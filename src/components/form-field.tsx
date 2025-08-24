import React from "react";

interface FormFieldRootProps {
  children: React.ReactNode;
  className?: string;
}

function Root({ children, className }: FormFieldRootProps) {
  return <label className={"flex flex-col gap-1 " + (className ?? "")}>{children}</label>;
}

interface FormFieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

function Label({ children, required }: FormFieldLabelProps) {
  return (
    <span className="text-sm text-[#181111]">
      {children}
      {required ? <span className="text-red-500">*</span> : null}
    </span>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface BaseControlProps {
  as?: "input" | "textarea";
  className?: string;
}

type FormFieldControlProps = BaseControlProps & (InputProps | TextareaProps);

function Control(props: FormFieldControlProps) {
  const { as = "input", className, ...rest } = props as BaseControlProps & Record<string, unknown>;
  const base = "h-10 rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none";
  if (as === "textarea") {
    return <textarea className={(className ? className + " " : "") + base} {...(rest as TextareaProps)} />;
  }
  return <input className={(className ? className + " " : "") + base} {...(rest as InputProps)} />;
}

interface FormFieldMessageProps {
  children?: React.ReactNode;
}

function Message({ children }: FormFieldMessageProps) {
  if (!children) return null;
  return <p className="text-xs text-[#886364]">{children}</p>;
}

export const FormField = Object.assign(Root, {
  Label,
  Control,
  Message,
}); 