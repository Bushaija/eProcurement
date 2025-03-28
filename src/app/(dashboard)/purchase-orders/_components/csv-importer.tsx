"use client"

import * as React from "react"
import { ArrowLeftIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CommandList } from "cmdk"

import { cn } from "@/lib/utils"

import { useParseCsv } from "@/hooks/use-parse-csv"
// import { useUploadFile } from "@/hooks/use-upload-file"

import { Button, type ButtonProps } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { FileUploader } from "@/components/file-uploader"
import { FileUploader } from "@/app/(dashboard)/purchase-orders/_components/file-uploader"
import { useUploadFile } from "@/hooks/use-upload-file"
import { Upload } from "lucide-react"
interface CsvImporterProps
  extends React.ComponentPropsWithoutRef<typeof DialogTrigger>,
    ButtonProps {
  /**
   * Array of field mappings defining the imported data structure.
   * Each includes a label, value, and optional required flag.
   * @example fields={[{ label: 'Name', value: 'name', required: true }, { label: 'Email', value: 'email' }]}
   */
  fields: {
    /**
     * Field display label shown to the user.
     * @example "Name"
     */
    label: string

    /**
     * Key identifying the field in the imported data.
     * @example "name"
     */
    value: string

    /**
     * Optional flag indicating if the field is required.
     * Required fields cannot be unchecked during mapping.
     * @default false
     * @example true
     */
    required?: boolean
  }[]

  /**
   * Callback function called on data import.
   * Receives an array of records as key-value pairs.
   * @example onImport={(data) => console.log(data)}
   */
  onImport: (data: Record<string, unknown>[]) => void
}

export function CsvImporter({
  fields,
  onImport,
  className,
  ...props
}: CsvImporterProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<"upload" | "map">("upload")
  const {
    data,
    fieldMappings,
    onParse,
    onFieldChange,
    onFieldToggle,
    onFieldsReset,
    getSanitizedData,
  } = useParseCsv({ fields })
  const [loading, setLoading] = React.useState(false);
  // const { onUpload, isUploading } = useUploadFile("csvUploader")
  const { onUpload, isUploading } = useUploadFile()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("w-fit text-sm font-regular border-gray-400 text-gray-700", className)} {...props}>
        <Upload className="size-4 mr-2" /> Import
        </Button>
      </DialogTrigger>
      {step === "upload" ? (
        <DialogContent className="p-8 sm:max-w-xl border-2 bg-white text-gray-700">
          <DialogHeader>
            <DialogTitle>Upload CSV</DialogTitle>
            <DialogDescription>
              Drag and drop your files here or click to browse.
            </DialogDescription>
          </DialogHeader>
          <FileUploader
            accept={{ "text/csv": [] }}
            multiple={false}
            maxSize={4 * 1024 * 1024}
            maxFileCount={1}
            /**
             * alternatively this can be used without uploading the file
             */
            // onValueChange={(files) => {
            //   const file = files[0]
            //   if (!file) return

            //   onParse({ file, limit: 1001 })

            //   setStep("map")
            // }}


            onUpload={async (files) => {
              const file = files[0]
              console.log("file[0]: ", file);
              
              if (!file) return
              await onUpload(files)

              onParse({ file, limit: 1001 })
              setStep("map")
            }}
            disabled={isUploading}
          />
        </DialogContent>
      ) : (
        <DialogContent className="overflow-hidden p-8 sm:max-w-6xl bg-gray-50 text-gray-700">
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <DialogHeader className="flex-1">
              <DialogTitle>Map fields</DialogTitle>
              <DialogDescription>
                Map the CSV fields to the corresponding table fields.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              onClick={onFieldsReset}
            >
              Reset
            </Button>
          </div>
          <div className="grid h-[26.25rem] w-full overflow-hidden rounded-md">
            <Table className="border-b border-gray-400 border-[1px]">
              <TableHeader className="sticky top-0 z-10 bg-background shadow">
                <TableRow className="bg-muted/50 border-red-400 border-[1px]">
                  {fields.map((field) => (
                    <PreviewTableHead
                      key={field.value}
                      field={field}
                      onFieldChange={(f) => {
                        onFieldChange({
                          oldValue: f.value,
                          newValue: field.value,
                        })
                      }}
                      onFieldToggle={onFieldToggle}
                      originalFieldMappings={fieldMappings.original}
                      currentFieldMapping={fieldMappings.current[field.value]}
                      className="border-r border-gray-400 border-[1px] text-gray-900 font-semibold"
                    />
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="border-2 text-gray-700 border-gray-400 border-[1px]">
                {data.map((row, i) => (
                  <TableRow key={i} className="h-10">
                    {fields.map((field) => (
                      <TableCell
                        key={field.value}
                        className="border-r last:border-r-0 border-gray-400 border-[1px]"
                      >
                        <span className="line-clamp-1">
                          {String(row[field.value] ?? "")}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Back
            </Button>

            <Button
              onClick={async () => {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 100))
                onImport(getSanitizedData({ data }))
                setLoading(false);
                setOpen(false)
                setStep("upload")
              }}
              disabled={loading}
            >
              {loading ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

interface PreviewTableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  field: { label: string; value: string; required?: boolean }
  onFieldChange: (props: { value: string; required?: boolean }) => void
  onFieldToggle: (props: { value: string; checked: boolean }) => void
  currentFieldMapping: string | undefined
  originalFieldMappings: Record<string, string | undefined>
}

function PreviewTableHead({
  field,
  onFieldChange,
  onFieldToggle,
  currentFieldMapping,
  originalFieldMappings,
  className,
  ...props
}: PreviewTableHeadProps) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)

  return (
    <TableHead className={cn("whitespace-nowrap py-2", className)} {...props}>
      <div className="flex items-center gap-4 pr-1.5">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-${field.value}`}
            defaultChecked
            onCheckedChange={(checked) => {
              onFieldToggle({
                value: field.value,
                checked: !!checked,
              })
            }}
            disabled={field.required}
          />
          <Label htmlFor={`${id}-${field.value}`} className="truncate">
            {field.label}
          </Label>
        </div>
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="w-48 justify-between border-gray-400 border-[1px]"
            >
              {currentFieldMapping || "Select field..."}
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-gray-400 border-[1px] bg-gray-50">
            <Command>
              <CommandInput placeholder="Search field..." />
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {[...new Set(Object.values(originalFieldMappings))].map(
                    (fm) => (
                      <CommandItem
                        key={fm}
                        value={fm}
                        onSelect={() => {
                          onFieldChange({
                            value: fm ?? "",
                          })
                          setOpen(false)
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4 border-[2px] border-gray-200",
                            currentFieldMapping === fm
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="line-clamp-1">{fm}</span>
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  )
}
