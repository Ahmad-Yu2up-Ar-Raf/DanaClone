import { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native';

// 🔥 REAL-TIME VALIDATION HOOK
// Usage: const { formData, errors, handleChange, handleSubmit, registerField } = useFormValidation(...)

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | undefined;
}

export interface FormField<T> {
  name: keyof T;
  rules?: ValidationRule;
  ref?: React.RefObject<TextInput>;
}

interface UseFormValidationProps<T extends Record<string, string>> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  onSubmit,
}: UseFormValidationProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Store field refs and validation rules
  const fieldRefs = useRef<Map<keyof T, React.RefObject<TextInput>>>(new Map());
  const validationRules = useRef<Map<keyof T, ValidationRule>>(new Map());

  // Register field with ref and validation rules
  const registerField = useCallback((field: FormField<T>) => {
    if (field.ref) {
      fieldRefs.current.set(field.name, field.ref);
    }
    if (field.rules) {
      validationRules.current.set(field.name, field.rules);
    }
  }, []);

  // Validate single field
  const validateField = useCallback((name: keyof T, value: string): string | undefined => {
    const rules = validationRules.current.get(name);
    if (!rules) return undefined;

    // Required check
    if (rules.required) {
      if (!value || value.trim() === '') {
        return typeof rules.required === 'string' ? rules.required : `${String(name)} is required`;
      }
    }

    // Min length check
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }

    // Max length check
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    // Custom validation
    if (rules.validate) {
      return rules.validate(value);
    }

    return undefined;
  }, []);

  // 🔥 REAL-TIME onChange handler
  const handleChange = useCallback(
    (name: keyof T) => (text: string) => {
      setFormData((prev) => ({ ...prev, [name]: text }));

      // 🔥 Real-time validation - validate as user types
      if (touched[name]) {
        const error = validateField(name, text);
        setErrors((prev) => {
          if (error) {
            return { ...prev, [name]: error };
          } else {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          }
        });
      }
    },
    [touched, validateField]
  );

  // Handle field blur - mark as touched
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur
      const error = validateField(name, formData[name]);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
      });
    },
    [formData, validateField]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // 🔥 AUTO-FOCUS on first error field
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0] as keyof T;
      const inputRef = fieldRefs.current.get(firstErrorField);
      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }

    return isValid;
  }, [formData, validateField]);

  // Handle form submit
  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    const isValid = validateAll();

    if (isValid) {
      await onSubmit(formData);
    }
  }, [formData, validateAll, onSubmit]);

  // Reset form
  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Set specific field error (for server-side errors)
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Auto-focus on error field
    const inputRef = fieldRefs.current.get(name);
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    registerField,
    setFieldError,
    reset,
  };
}

// 🔥 PRE-DEFINED VALIDATION RULES
export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      message: 'Invalid email format',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },
  required: (fieldName: string = 'This field') => ({
    required: `${fieldName} is required`,
  }),
  minLength: (length: number, fieldName: string = 'This field') => ({
    minLength: {
      value: length,
      message: `${fieldName} must be at least ${length} characters`,
    },
  }),
  maxLength: (length: number, fieldName: string = 'This field') => ({
    maxLength: {
      value: length,
      message: `${fieldName} must not exceed ${length} characters`,
    },
  }),
  numeric: {
    pattern: {
      value: /^[0-9]+$/,
      message: 'Only numbers are allowed',
    },
  },
};
