import { useForm, UseFormProps } from 'react-hook-form';
import z from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { defaultInstance } from './zod-defaults';

export { useController as useInputController, Control as InputControl } from 'react-hook-form';

export function useInputData<S extends z.AnyZodObject | z.ZodDefault<any> | z.ZodEffects<any>>({schema, reValidateMode = "onChange", mode="onChange", ...props}: UseFormProps & {schema?: S} = {}) {
    
    const r = useForm<z.infer<S>>({...props, mode, resolver: schema ? zodResolver(schema) : undefined, defaultValues: {
        ...(schema ? defaultInstance(schema) : {}),
        ...props.defaultValues,
    },
    
 })

    return {
        errors: r?.formState?.errors,
        isValid: r?.formState?.isValid,
        ...r,
    }
}
