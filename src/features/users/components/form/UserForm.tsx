import {
  FormProvider,
  useForm,
} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Role, Permission } from "@/types/api.interfaces";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/password-input";

type UserFormValues = {
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions: string[];
};

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
  roles: Role[];
  permissions: Permission[];
  isEdit?: boolean;
  initialData?: Partial<UserFormValues>;
}

export const UserForm = ({
  onSubmit,
  onCancel,
  roles,
  permissions,
  isEdit,
  initialData,
}: UserFormProps) => {
  const { t: messages } = useTranslation();
  const passwordSchema = z
    .string()
    .min(8, { message: messages("auth.passwordMinLength") })
    .regex(/[A-Z]/, { message: messages("auth.passwordUppercase") })
    .regex(/[a-z]/, { message: messages("auth.passwordLowercase") })
    .regex(/[0-9]/, { message: messages("auth.passwordNumber") })
    .regex(/[^A-Za-z0-9]/, { message: messages("auth.passwordSpecialCharacter") });

  const formSchema = z.object({
    name: z.string().min(1, messages("Users.nameRequired")),
    email: z.string().email(messages("Users.validEmail")),
    password: isEdit
      ? z
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val))
        .refine(
          (val) =>
            !val || passwordSchema.safeParse(val).success,
          {
            message: messages("auth.invalidPassword"),
          }
        )
      : passwordSchema,
    role: z.string().min(1, messages("Users.roleRequired")),
    permissions: z.array(z.string()),
  });
  const methods = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      password: "",
      role: initialData?.role ?? "",
      permissions: initialData?.permissions ?? [],
    },
  });
  const { watch, setValue } = methods;
  const selectedPermissions = watch("permissions");
  const selectedRole = watch("role");

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Users.nameLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages("Users.emailLabel")}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <PasswordInput id="password" name="password" label={messages("auth.passwordLabel")} />
          <FormField
            control={methods.control}
            name="role"
            render={() => (
              <FormItem>
                <FormLabel>{messages("Users.roleLabel")}</FormLabel>
                <FormControl className="w-full">
                  <Select
                    value={selectedRole}
                    onValueChange={(val) => setValue("role", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={messages("Users.selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={methods.control}
          name="permissions"
          render={() => {
            const [searchTerm, setSearchTerm] = useState("");

            const groupedPermissions = permissions.reduce((acc, perm) => {
              const [, resourceType] = perm.name.split("-");
              if (!acc[resourceType]) acc[resourceType] = [];
              acc[resourceType].push(perm);
              return acc;
            }, {} as Record<string, typeof permissions>);

            const handlePermissionChange = (permName: string, checked: boolean) => {
              const current = selectedPermissions || [];
              const [, resourceType] = permName.split("-");
              const viewPermission = `view-${resourceType}`;

              let newPermissions = [...current];

              if (checked) {
                newPermissions.push(permName);
                if (permName !== viewPermission && permissions.some(p => p.name === viewPermission)) {
                  newPermissions.push(viewPermission);
                }
              } else {
                newPermissions = newPermissions.filter(name => name !== permName);
                if (permName === viewPermission) {
                  newPermissions = newPermissions.filter(name => !name.endsWith(`-${resourceType}`));
                }
              }

              newPermissions = [...new Set(newPermissions)];
              setValue("permissions", newPermissions);
            };

            const filteredGrouped = Object.entries(groupedPermissions).filter(([resourceType]) =>
              resourceType.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
              <FormItem>
                <div className="flex items-center justify-between mb-4">
                  <FormLabel className="text-lg font-semibold text-gray-800">
                    {messages("Users.permissionsLabel")}
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={permissions.every(p => selectedPermissions?.includes(p.name))}
                      onCheckedChange={(checked) => {
                        const allNames = permissions.map(p => p.name);
                        setValue("permissions", checked ? allNames : []);
                      }}
                    />
                    <Label htmlFor="select-all" className="text-sm text-gray-600">
                      {messages("Users.selectAll")}
                    </Label>
                  </div>
                </div>

                <FormControl>
                  <div className="bg-white border rounded-xl shadow p-4">
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder={messages("Users.searchPermissionsPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <ScrollArea className="h-72 space-y-6 pr-2">
                      {filteredGrouped.length ? (
                        filteredGrouped.map(([resourceType, sectionPermissions]) => {
                          const allSelectedInSection = sectionPermissions.every(p =>
                            selectedPermissions?.includes(p.name)
                          );
                          const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

                          return (
                            <div key={resourceType} className="bg-gray-50 border border-gray-200 rounded-md p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-700 capitalize">
                                  {messages(`Sidebar.${capitalize(resourceType)}`) || capitalize(resourceType)}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`select-all-${resourceType}`}
                                    checked={allSelectedInSection}
                                    onCheckedChange={(checked) => {
                                      const names = sectionPermissions.map(p => p.name);
                                      const newPermissions = checked
                                        ? [...new Set([...(selectedPermissions || []), ...names])]
                                        : (selectedPermissions || []).filter(name => !names.includes(name));
                                      setValue("permissions", newPermissions);
                                    }}
                                  />
                                  <Label htmlFor={`select-all-${resourceType}`} className="text-xs text-gray-600">
                                    {messages("Users.selectAll")}
                                  </Label>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {sectionPermissions
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((perm) => (
                                    <div key={perm.id} className="flex items-center gap-3 hover:bg-white p-2 rounded-md">
                                      <Checkbox
                                        id={`perm-${perm.id}`}
                                        checked={selectedPermissions?.includes(perm.name)}
                                        onCheckedChange={(checked) =>
                                          handlePermissionChange(perm.name, !!checked)
                                        }
                                      />
                                      <Label htmlFor={`perm-${perm.id}`} className="text-sm text-gray-800 capitalize">
                                        {messages(`actions.${perm.name.split("-")[0]}`)}
                                      </Label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          {messages("Users.noMatchPermissions")}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {messages("actions.cancel")}
          </Button>
          <Button type="submit">{isEdit ? messages("actions.update") : messages("actions.create")}</Button>
        </div>
      </form>
    </FormProvider>
  );
};
