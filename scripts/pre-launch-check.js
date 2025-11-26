#!/usr/bin/env node

/**
 * 上线前全面检查脚本
 * 运行: node scripts/pre-launch-check.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let issues = [];
let warnings = [];
let passed = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(description, condition, isWarning = false) {
  if (condition) {
    passed.push(description);
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    if (isWarning) {
      warnings.push(description);
      log(`⚠ ${description}`, 'yellow');
    } else {
      issues.push(description);
      log(`✗ ${description}`, 'red');
    }
    return false;
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function checkFileContains(filePath, pattern) {
  if (!checkFileExists(filePath)) return false;
  const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
  return pattern.test(content);
}

function checkEnvVar(envVar, pattern) {
  const value = process.env[envVar];
  if (!value) return false;
  if (pattern) return pattern.test(value);
  return value.length > 0;
}

log('\n🚀 开始上线前全面检查...\n', 'cyan');
log('='.repeat(60), 'blue');

// 1. 环境变量配置检查
log('\n1. 环境变量配置检查', 'cyan');
log('-'.repeat(60), 'blue');

// 检查 .gitignore
check(
  '.env.local 文件已在 .gitignore 中',
  checkFileContains('.gitignore', /\.env.*local/i)
);

// 检查 env.example 文件
check(
  'env.example 文件存在',
  checkFileExists('env.example')
);

// 检查必需环境变量（仅检查格式，不检查实际值）
const requiredEnvVars = {
  'NEXT_PUBLIC_URL': /^https:\/\//i,
  'STRIPE_SECRET_KEY': /^sk_live_/,
  'NEXT_PUBLIC_STRIPE_PRICE_ID': /^price_/,
  'STRIPE_WEBHOOK_SECRET': /^whsec_/,
  'DATABASE_URL': /^postgresql:\/\//,
  'CLERK_PUBLISHABLE_KEY': /^pk_live_/,
  'CLERK_SECRET_KEY': /^sk_live_/,
};

log('\n⚠️  注意: 以下检查需要在实际生产环境中验证:', 'yellow');
Object.keys(requiredEnvVars).forEach(envVar => {
  log(`  - ${envVar}`, 'yellow');
});

// 2. 数据库配置检查
log('\n2. 数据库配置检查', 'cyan');
log('-'.repeat(60), 'blue');

check(
  'prisma/schema.prisma 文件存在',
  checkFileExists('prisma/schema.prisma')
);

check(
  'Prisma migrations 目录存在',
  checkFileExists('prisma/migrations')
);

// 3. 安全性检查
log('\n3. 安全性检查', 'cyan');
log('-'.repeat(60), 'blue');

// 检查 .gitignore 中的敏感文件
check(
  '.env 文件已在 .gitignore 中',
  checkFileContains('.gitignore', /\.env\s*$/m)
);

// 检查 middleware.ts
check(
  'middleware.ts 文件存在',
  checkFileExists('middleware.ts')
);

// 检查 next.config.js 中的安全头
check(
  'next.config.js 文件存在',
  checkFileExists('next.config.js')
);

if (checkFileExists('next.config.js')) {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  check(
    'next.config.js 包含安全头配置',
    /X-Content-Type-Options|X-Frame-Options|X-XSS-Protection/.test(nextConfig)
  );
}

// 检查 Webhook 安全
if (checkFileExists('app/api/webhooks/stripe/route.ts')) {
  const webhookRoute = fs.readFileSync('app/api/webhooks/stripe/route.ts', 'utf8');
  check(
    'Stripe Webhook 路由包含签名验证',
    /stripe\.webhooks\.constructEvent|webhookSecret/.test(webhookRoute)
  );
  check(
    'Stripe Webhook 在生产环境强制验证',
    /NODE_ENV.*production.*webhookSecret/.test(webhookRoute.replace(/\s+/g, ' '))
  );
}

// 4. 构建和部署检查
log('\n4. 构建和部署检查', 'cyan');
log('-'.repeat(60), 'blue');

check(
  'package.json 文件存在',
  checkFileExists('package.json')
);

check(
  'tsconfig.json 文件存在',
  checkFileExists('tsconfig.json')
);

if (checkFileExists('tsconfig.json')) {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  check(
    'TypeScript 严格模式已启用',
    tsconfig.compilerOptions?.strict === true
  );
}

check(
  'next.config.js 文件存在',
  checkFileExists('next.config.js')
);

// 5. 代码质量检查
log('\n5. 代码质量检查', 'cyan');
log('-'.repeat(60), 'blue');

// 检查是否有 console.log（警告）
const apiDir = 'app/api';
if (fs.existsSync(apiDir)) {
  let consoleLogCount = 0;
  function countConsoleLogs(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        countConsoleLogs(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(/console\.log\(/g);
        if (matches) {
          consoleLogCount += matches.length;
        }
      }
    });
  }
  countConsoleLogs(apiDir);
  check(
    `API 路由中的 console.log 数量: ${consoleLogCount}`,
    consoleLogCount < 10,
    true // 警告
  );
}

// 6. 文档完整性检查
log('\n6. 文档完整性检查', 'cyan');
log('-'.repeat(60), 'blue');

check(
  'README.md 文件存在',
  checkFileExists('README.md')
);

check(
  'SETUP.md 文件存在',
  checkFileExists('SETUP.md')
);

check(
  'env.example 文件存在',
  checkFileExists('env.example')
);

// 总结
log('\n' + '='.repeat(60), 'blue');
log('\n📊 检查结果总结', 'cyan');
log('-'.repeat(60), 'blue');

log(`\n✅ 通过: ${passed.length}`, 'green');
log(`⚠️  警告: ${warnings.length}`, 'yellow');
log(`❌ 问题: ${issues.length}`, 'red');

if (warnings.length > 0) {
  log('\n⚠️  警告列表:', 'yellow');
  warnings.forEach(w => log(`  - ${w}`, 'yellow'));
}

if (issues.length > 0) {
  log('\n❌ 需要修复的问题:', 'red');
  issues.forEach(i => log(`  - ${i}`, 'red'));
  process.exit(1);
} else {
  log('\n✅ 所有检查通过！', 'green');
  log('\n⚠️  请记住:', 'yellow');
  log('  1. 在生产环境中验证所有环境变量配置', 'yellow');
  log('  2. 运行 npm run build 确保构建成功', 'yellow');
  log('  3. 运行 npx prisma migrate status 检查数据库迁移', 'yellow');
  log('  4. 测试所有关键功能', 'yellow');
  log('  5. 检查性能指标（Lighthouse 评分 ≥90）', 'yellow');
}

