import { clsx } from "clsx";

type TableElement = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  children: React.ReactNode;
};

export function Table({ className, children, ...props }: TableElement) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-surface-border">
      <table
        className={clsx("w-full border-collapse text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ className, children, ...props }: TableElement) {
  return (
    <thead
      className={clsx("bg-surface-muted text-left", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: TableElement) {
  return (
    <tbody
      className={clsx(
        "[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-surface-border",
        "[&>tr:nth-child(even)]:bg-surface-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: TableElement) {
  return (
    <tr
      className={clsx("transition-colors hover:bg-surface-muted", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode }) {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted",
        "border-b border-surface-border",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode }) {
  return (
    <td
      className={clsx("px-4 py-3 text-text", className)}
      {...props}
    >
      {children}
    </td>
  );
}
