import { getIndicatorKnowledge } from '../../../client_web/src/lib/numerologyReportGenerator';

console.log('=== TEST GET INDICATOR KNOWLEDGE ===');

const indicators = [
  { code: 'life_path', num: 11 },
  { code: 'soul_bridge', num: 1 },
  { code: 'soul_bridge', num: 8 },
  { code: 'attitude', num: 1 },
  { code: 'karmic_debt', num: 19 },
  { code: 'karmic_lessons', num: 4 },
  { code: 'rational_thought', num: 8 },
  { code: 'generation', num: 9 },
  { code: 'personal_month', num: 8 }
];

indicators.forEach(({ code, num }) => {
  const data = getIndicatorKnowledge(code, num);
  console.log(`\n--------------------------------------------`);
  console.log(`[${code.toUpperCase()}_${num}] ${data.indicator_name}`);
  console.log(`Core Energy: ${data.core_energy}`);
  console.log(`Full Description Length: ${(data.full_description || '').length} chars`);
  console.log(`Full Description Preview:\n${(data.full_description || '').slice(0, 350)}...`);
});
