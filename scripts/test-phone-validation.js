#!/usr/bin/env node

/**
 * 测试电话号码验证修复
 * 运行: node scripts/test-phone-validation.js
 */

const { validatePhone } = require('../lib/validation.ts')

// 测试用例
const testCases = [
  // 美国电话号码 - 应该通过
  { phone: '5551234567', country: 'US', expected: true, description: '10位本地号码' },
  { phone: '15551234567', country: 'US', expected: true, description: '11位带国家代码' },
  { phone: '+15551234567', country: 'US', expected: true, description: '带+号的11位' },
  { phone: '(555) 123-4567', country: 'US', expected: true, description: '带格式的10位' },
  { phone: '555-123-4567', country: 'US', expected: true, description: '带连字符的10位' },
  { phone: '1-555-123-4567', country: 'US', expected: true, description: '带格式的11位' },
  
  // 美国电话号码 - 应该失败
  { phone: '123456789', country: 'US', expected: false, description: '9位数字（太短）' },
  { phone: '123456789012', country: 'US', expected: false, description: '12位数字（太长）' },
  { phone: '25551234567', country: 'US', expected: false, description: '11位但国家代码错误' },
  
  // 加拿大电话号码 - 应该通过
  { phone: '5551234567', country: 'CA', expected: true, description: '10位本地号码' },
  { phone: '15551234567', country: 'CA', expected: true, description: '11位带国家代码' },
  
  // 其他测试
  { phone: '', country: 'US', expected: false, description: '空字符串' },
]

console.log('🧪 测试电话号码验证修复...\n')

let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  const result = validatePhone(testCase.phone, testCase.country)
  const success = result.valid === testCase.expected
  
  if (success) {
    console.log(`✅ 测试 ${index + 1}: ${testCase.description} - 通过`)
    passed++
  } else {
    console.log(`❌ 测试 ${index + 1}: ${testCase.description} - 失败`)
    console.log(`   输入: "${testCase.phone}" (${testCase.country})`)
    console.log(`   期望: ${testCase.expected ? '有效' : '无效'}`)
    console.log(`   实际: ${result.valid ? '有效' : '无效'}`)
    if (result.error) {
      console.log(`   错误: ${result.error}`)
    }
    failed++
  }
})

console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`)

if (failed === 0) {
  console.log('✅ 所有测试通过！')
  process.exit(0)
} else {
  console.log('❌ 部分测试失败')
  process.exit(1)
}

