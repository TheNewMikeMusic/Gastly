/**
 * 输入验证工具函数
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' }
  }

  // 检查长度
  if (email.length > 254) {
    return { valid: false, error: 'Email address is too long' }
  }

  return { valid: true }
}

/**
 * 验证电话号码（基本验证，支持国际格式）
 */
export function validatePhone(phone: string, country?: string): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' }
  }

  // 移除空格、连字符、括号等
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // 基本格式检查：至少7位数字，最多15位（E.164标准）
  if (!/^\+?[1-9]\d{6,14}$/.test(cleaned)) {
    return { valid: false, error: 'Please enter a valid phone number' }
  }

  // 国家特定验证
  if (country) {
    const countryRules: Record<string, { min: number; max: number; pattern?: RegExp; allowLocal?: boolean }> = {
      // US: 支持 10位本地号码 (5551234567) 或 11位带国家代码 (+1 或 1)
      US: { 
        min: 10, 
        max: 11, 
        pattern: /^(\+?1)?\d{10}$/,
        allowLocal: true 
      },
      // CA: 支持 10位本地号码或 11位带国家代码
      CA: { 
        min: 10, 
        max: 11, 
        pattern: /^(\+?1)?\d{10}$/,
        allowLocal: true 
      },
      GB: { min: 10, max: 11, pattern: /^\+?44\d{10,11}$/ },
      CN: { min: 11, max: 11, pattern: /^\+?86\d{11}$/ },
      JP: { min: 10, max: 11, pattern: /^\+?81\d{9,10}$/ },
    }

    const rule = countryRules[country]
    if (rule) {
      const digitsOnly = cleaned.replace(/\D/g, '')
      
      // 对于 US/CA，如果允许本地格式，检查是否为10位或11位（带国家代码）
      if (rule.allowLocal) {
        // 10位本地号码或11位带国家代码（1开头）
        if (digitsOnly.length === 10) {
          // 10位本地号码，验证格式
          if (!/^\d{10}$/.test(digitsOnly)) {
            return { valid: false, error: `Invalid phone number format for ${country}` }
          }
        } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
          // 11位带国家代码，验证格式
          if (!/^1\d{10}$/.test(digitsOnly)) {
            return { valid: false, error: `Invalid phone number format for ${country}` }
          }
        } else {
          return {
            valid: false,
            error: `Phone number for ${country} should be 10 digits (local) or 11 digits (with country code)`,
          }
        }
      } else {
        // 其他国家的标准验证
        if (digitsOnly.length < rule.min || digitsOnly.length > rule.max) {
          return {
            valid: false,
            error: `Phone number for ${country} should be ${rule.min}-${rule.max} digits`,
          }
        }
        if (rule.pattern && !rule.pattern.test(cleaned)) {
          return { valid: false, error: `Invalid phone number format for ${country}` }
        }
      }
    }
  }

  return { valid: true }
}

/**
 * 验证地址
 */
export function validateAddress(address: string): ValidationResult {
  if (!address || address.trim().length === 0) {
    return { valid: false, error: 'Address is required' }
  }

  if (address.trim().length < 5) {
    return { valid: false, error: 'Address is too short' }
  }

  if (address.length > 500) {
    return { valid: false, error: 'Address is too long' }
  }

  return { valid: true }
}

/**
 * 验证邮政编码
 */
export function validateZip(zip: string, country?: string): ValidationResult {
  if (!zip || zip.trim().length === 0) {
    return { valid: false, error: 'ZIP/Postal code is required' }
  }

  const cleaned = zip.trim().toUpperCase()

  // 国家特定验证
  if (country) {
    const countryPatterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/, // 12345 or 12345-6789
      CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, // A1A 1A1
      GB: /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, // SW1A 1AA
      CN: /^\d{6}$/, // 123456
      JP: /^\d{3}-\d{4}$/, // 123-4567
    }

    const pattern = countryPatterns[country]
    if (pattern && !pattern.test(cleaned)) {
      return { valid: false, error: `Invalid ZIP/Postal code format for ${country}` }
    }
  }

  return { valid: true }
}

/**
 * 验证姓名
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Name is too short' }
  }

  if (name.length > 100) {
    return { valid: false, error: 'Name is too long' }
  }

  // 检查是否包含有效字符（字母、空格、连字符、撇号）
  if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }

  return { valid: true }
}

/**
 * 验证城市
 */
export function validateCity(city: string): ValidationResult {
  if (!city || city.trim().length === 0) {
    return { valid: false, error: 'City is required' }
  }

  if (city.trim().length < 2) {
    return { valid: false, error: 'City name is too short' }
  }

  if (city.length > 100) {
    return { valid: false, error: 'City name is too long' }
  }

  return { valid: true }
}

/**
 * 验证州/省
 */
export function validateState(state: string, country?: string): ValidationResult {
  // 某些国家不需要州/省
  const countriesWithoutState = ['SG', 'HK', 'MO']
  if (country && countriesWithoutState.includes(country)) {
    return { valid: true }
  }

  if (!state || state.trim().length === 0) {
    return { valid: false, error: 'State/Province is required' }
  }

  if (state.trim().length < 2) {
    return { valid: false, error: 'State/Province is too short' }
  }

  if (state.length > 100) {
    return { valid: false, error: 'State/Province is too long' }
  }

  return { valid: true }
}

/**
 * 清理和验证输入（防止XSS）
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input) return ''

  // 移除HTML标签
  let cleaned = input.replace(/<[^>]*>/g, '')

  // 转义特殊字符
  cleaned = cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  // 限制长度
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength)
  }

  return cleaned.trim()
}

/**
 * 验证优惠券代码格式
 */
export function validateCouponCode(code: string): ValidationResult {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Coupon code is required' }
  }

  const cleaned = code.trim().toUpperCase()

  // 优惠券代码：3-20个字符，只能包含字母、数字、连字符、下划线
  if (!/^[A-Z0-9_-]{3,20}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Coupon code must be 3-20 characters and contain only letters, numbers, hyphens, or underscores',
    }
  }

  return { valid: true }
}

