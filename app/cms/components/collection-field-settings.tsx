import * as React from "react";

import { EyeOff, GripVertical, MoreVertical, Pencil } from "lucide-react";
import { Field } from "~/models/content.server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cms/components/ui/dropdown-menu";

interface CollectionFieldSettingsProps {
  field: Pick<Field, "title" | "sortOrder">;
}

const CollectionFieldSettings = React.forwardRef<
  HTMLDivElement,
  CollectionFieldSettingsProps
>(({ field, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="flex justify-between items-center p-4 bg-foreground/10 hover:bg-foreground/20 text-foreground/80 hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-start space-x-4">
        <GripVertical className="w-5 h-5" />
        <p>
          {field.title} - {field.sortOrder}
        </p>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Pencil className="w-5 h-5 mr-4" /> Edit Field
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EyeOff className="w-5 h-5 mr-4" /> Hide Field
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Half Width</DropdownMenuItem>
            <DropdownMenuItem>Full Width</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete Field</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

export { CollectionFieldSettings };
