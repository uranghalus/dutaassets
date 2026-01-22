'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PERMISSIONS } from '@/constants/permissions';

type Props = {
    value: Record<string, string[]>;
    onChange: (value: Record<string, string[]>) => void;
};

export function PermissionCheckboxGroup({ value, onChange }: Props) {
    const toggle = (resource: string, action: string, checked: boolean) => {
        const current = value[resource] ?? [];

        const updated = checked
            ? [...new Set([...current, action])]
            : current.filter((a) => a !== action);

        const next = { ...value };
        if (updated.length === 0) delete next[resource];
        else next[resource] = updated;

        onChange(next);
    };

    return (
        <div className="space-y-4">
            {Object.entries(PERMISSIONS).map(([resource, actions]) => (
                <div key={resource} className="rounded-md border p-3">
                    <h4 className="font-medium capitalize mb-2">{resource}</h4>

                    <div className="grid grid-cols-2 gap-2">
                        {actions.map((action) => {
                            const checked = value[resource]?.includes(action) ?? false;

                            return (
                                <Label key={action} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(v) =>
                                            toggle(resource, action, Boolean(v))
                                        }
                                    />
                                    <span className="capitalize">{action}</span>
                                </Label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
