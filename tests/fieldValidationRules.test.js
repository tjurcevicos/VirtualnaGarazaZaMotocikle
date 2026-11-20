import test from 'node:test'
import assert from 'node:assert/strict'
import { validateGarageField } from '../src/utils/fieldValidationRules.js'

test('obavezna polja odbijaju prazan unos', () => {
  assert.equal(validateGarageField('brand', '  '), 'Obavezno polje.')
  assert.equal(validateGarageField('brand', 'Honda'), '')
})

test('godina slijedi pravila obrasca za motocikle', () => {
  assert.equal(validateGarageField('year', '1899'), 'Unesi valjanu godinu proizvodnje.')
  assert.equal(validateGarageField('year', String(new Date().getFullYear() + 1)), 'Unesi valjanu godinu proizvodnje.')
  assert.equal(validateGarageField('year', '2020'), '')
})

test('brojčana polja odbijaju nevaljane i negativne vrijednosti', () => {
  assert.equal(validateGarageField('mileage', '-1'), 'Vrijednost ne može biti negativna.')
  assert.equal(validateGarageField('price', '0'), 'Vrijednost mora biti veća od nule.')
  assert.equal(validateGarageField('liters', 'abc'), 'Unesi valjanu brojčanu vrijednost.')
  assert.equal(validateGarageField('mileage', '0'), '')
})
