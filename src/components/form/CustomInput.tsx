import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'


interface CustomInputProps {
  control: Control<z.infer<ReturnType<typeof authFormSchema>>>,
  name: FieldPath<z.infer<ReturnType<typeof authFormSchema>>>,
  label: string,
  placeholder: string,
  id: string,
}

const CustomInput = ({ control, name, label, placeholder, id }: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <FormLabel className="text-base w-full max-w-[280px] font-medium text-gray-700">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input 
                id={id}
                placeholder={placeholder}
                className="text-base placeholder:text-gray-400"
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-500 mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput