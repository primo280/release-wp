"use client"

import { Ref, useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Controller, FieldPath, FieldValues, UseFormReturn } from "react-hook-form"

import { TDictionary } from "@/lib/langs"
import { cn, stringToSlug } from "@/lib/utils"
import { Checkbox } from "@nextui-org/checkbox"
import { Input, InputProps } from "@nextui-org/input"
import { Tooltip } from "@nextui-org/tooltip"

import { Icons } from "../icons"

import { FormFieldDr, WithPasswordStrengthPopoverDr } from "./form.dr"

const numberRegex = /[\d]/
const lowercaseRegex = /[a-z]/
const uppercaseRegex = /[A-Z]/
const specialRegex = /[!@#$%^&*\.]/

const WithPasswordStrengthPopover = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  form,
  name,
  isFocused,
  dictionary,
  showPasswordPopoverCondition,
}: {
  children: React.ReactNode
  form: UseFormReturn<TFieldValues>
  name: TName
  isFocused: boolean
  dictionary: TDictionary<typeof WithPasswordStrengthPopoverDr>
  showPasswordPopoverCondition?: (passwordValue: string) => boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const passwordValue = form.watch(name)
  const passwordStrengthValue = passwordValue
    ? [
        passwordValue.length >= 8,
        numberRegex.test(passwordValue),
        lowercaseRegex.test(passwordValue),
        uppercaseRegex.test(passwordValue),
        specialRegex.test(passwordValue),
      ].filter(Boolean).length
    : 0

  const updatePopoverPosition = useCallback(() => {
    const inputWrapper = inputRef.current?.querySelector(".input-wrapper")
    if (!inputWrapper) return
    const position = inputWrapper.getBoundingClientRect()
    if (position && popoverRef.current) {
      popoverRef.current.style.top = `${position.top + position.height + 8}px`
      popoverRef.current.style.left = `${position.left}px`
      popoverRef.current.style.width = `${position.width}px`
    }
  }, [])

  useEffect(() => {
    updatePopoverPosition()
    window.addEventListener("scroll", updatePopoverPosition)
    window.addEventListener("resize", updatePopoverPosition)
    return () => {
      window.removeEventListener("scroll", updatePopoverPosition)
      window.removeEventListener("resize", updatePopoverPosition)
    }
  }, [updatePopoverPosition])

  const [lastFocusPasswordValue, setLastFocusPasswordValue] = useState(passwordValue)
  useEffect(() => {
    if (isFocused) {
      setLastFocusPasswordValue(passwordValue)
    }
  }, [isFocused])

  const [passwordChangedSinceLastFocus, setPasswordChangedSinceLastFocus] = useState(false)

  useEffect(() => {
    if (lastFocusPasswordValue !== passwordValue && isFocused && !passwordChangedSinceLastFocus) {
      setPasswordChangedSinceLastFocus(true)
    }
  }, [passwordValue, isFocused, lastFocusPasswordValue, passwordChangedSinceLastFocus])

  const isDisplayed =
    isFocused &&
    (showPasswordPopoverCondition ? showPasswordPopoverCondition(passwordValue) : true) &&
    passwordChangedSinceLastFocus &&
    passwordStrengthValue < 5

  return (
    <div className="relative" ref={inputRef}>
      {children}
      {inputRef.current &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn(
              "fixed z-[1000] mt-2 rounded-lg border bg-white shadow-xl transition-all duration-200 ease-in-out p-3",
              "opacity-0 scale-95 pointer-events-none",
              {
                "opacity-100 scale-100 pointer-events-auto": isDisplayed,
              }
            )}
          >
            <div
              className={cn("h-2 w-full rounded-md transition-all duration-300", {
                "bg-red-500": passwordStrengthValue < 2,
                "bg-yellow-500": passwordStrengthValue >= 2 && passwordStrengthValue < 5,
                "bg-green-500": passwordStrengthValue === 5,
              })}
              style={{
                width: `${Math.max(2, (passwordStrengthValue / 5) * 100)}%`,
              }}
            />
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Checkbox isSelected={passwordValue.length >= 8} isDisabled color="success" size="sm">
                  {dictionary.min8Chars}
                </Checkbox>
              </li>
              <li>
                <Checkbox isSelected={numberRegex.test(passwordValue)} isDisabled color="success" size="sm">
                  {dictionary.containsNumber}
                </Checkbox>
              </li>
              <li>
                <Checkbox isSelected={lowercaseRegex.test(passwordValue)} isDisabled color="success" size="sm">
                  {dictionary.containsLowercase}
                </Checkbox>
              </li>
              <li>
                <Checkbox isSelected={uppercaseRegex.test(passwordValue)} isDisabled color="success" size="sm">
                  {dictionary.containsUppercase}
                </Checkbox>
              </li>
              <li>
                <Checkbox isSelected={specialRegex.test(passwordValue)} isDisabled color="success" size="sm">
                  {dictionary.containsSpecial}
                </Checkbox>
              </li>
            </ul>
          </div>,
          document.body
        )}
    </div>
  )
}

type IWithPasswordStrengthProps =
  | {
      passwordStrength?: never | false
      passwordtoggleVisibilityProps?: never
      dictionary?: never
      showPasswordPopoverCondition?: never
    }
  | {
      passwordStrength: true
      dictionary: TDictionary<typeof FormFieldDr>
      passwordtoggleVisibilityProps?: React.HTMLAttributes<HTMLButtonElement>
      showPasswordPopoverCondition?: (passwordValue: string) => boolean
    }

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<InputProps, "form" | "name" | "tooltip" | "type"> & {
  form: UseFormReturn<TFieldValues>
  name: TName
  tooltip?: string
  type: InputProps["type"] | "password-eye-slash" | "slug"
} & IWithPasswordStrengthProps

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  tooltip,
  type,
  passwordStrength,
  inputRef,
  dictionary,
  passwordtoggleVisibilityProps,
  showPasswordPopoverCondition,
  ...props
}: FormFieldProps<TFieldValues, TName> & {
  inputRef?: Ref<HTMLInputElement>
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  const typeToRealType = (type: FormFieldProps["type"]) => {
    switch (type) {
      case "password-eye-slash":
        return isVisible ? "text" : "password"
      case "slug":
        return "text"
      default:
        return type
    }
  }

  let input = (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Input
          {...field}
          {...props}
          ref={inputRef}
          className={cn("w-full mb-8 mt-4 h-2", props.className)}
          classNames={{ inputWrapper: "input-wrapper" }}
          onFocusChange={setIsFocused}
          type={typeToRealType(type)}
          isInvalid={!!form.formState.errors[name]}
          errorMessage={form.formState.errors[name]?.message?.toString()}
          endContent={
            props.endContent ||
            (type === "password-eye-slash" ? (
              <button
                className="text-xl text-default-400 hover:text-primary focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                {...passwordtoggleVisibilityProps}
              >
                {isVisible ? (
                  <Icons.eyeSlash className="pointer-events-none transition-all" />
                ) : (
                  <Icons.eye className="pointer-events-none transition-all" />
                )}
              </button>
            ) : undefined)
          }
          onChange={type === "slug" ? (e) => field.onChange(stringToSlug(e.target.value)) : field.onChange}
        />
      )}
    />
  )

  if (passwordStrength) {
    input = (
      <WithPasswordStrengthPopover
        form={form}
        name={name}
        isFocused={isFocused}
        dictionary={dictionary}
        showPasswordPopoverCondition={showPasswordPopoverCondition}
      >
        {input}
      </WithPasswordStrengthPopover>
    )
  }

  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <div className="relative">{input}</div>
      </Tooltip>
    )
  }

  return input
}
