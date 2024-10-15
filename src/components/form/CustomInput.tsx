import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'
import { useState } from 'react'


interface CustomInputProps {
  control: Control<z.infer<ReturnType<typeof authFormSchema>>>,
  name: FieldPath<z.infer<ReturnType<typeof authFormSchema>>>,
  label: string,
  placeholder: string,
  id: string,
  disabled?: boolean
}

const CustomInput = ({ control, name, label, placeholder, id, disabled }: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false)


  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1">
          <FormLabel className="text-base w-full font-medium text-gray-700">
            {label}
          </FormLabel>

          <div className="flex w-full flex-col relative">
            <FormControl>
              <>
                <Input
                  id={id}
                  placeholder={placeholder}
                  className="text-base placeholder:text-gray-400"
                  type={name === 'password' && !showPassword ? 'password' : 'text'}
                  {...field}
                  disabled={disabled}
                />
                {name === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    disabled={disabled}
                  >
                    {showPassword ? 'close' : 'show'}
                  </button>
                )}
              </>
            </FormControl>
          </div>

          <div className="h-5">
            <FormMessage className="text-sm text-red-500" />
          </div>
        </div>
      )}
    />
  )
}

export default CustomInput