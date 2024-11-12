import { z } from 'zod'

export const dnaSchema = z.object({
  dna: z.array(z.string(), {
    required_error: 'DNA is required',
    invalid_type_error: 'DNA must be an array of strings'
  })
})

export type Dna = z.infer<typeof dnaSchema>['dna']

/**
 * Checks if a DNA sequence has a mutant pattern (four identical bases in a row).
 *
 * @param dna - DNA sequence represented as an array of strings.
 * @returns `true` if the DNA is mutant, otherwise `false`.
 */
export const isMutant = (dna: Dna) => {
  const SEQUENCE_REGEX = /(A{4}|T{4}|C{4}|G{4})/

  const rows = dna

  const columns = dna[0].split('').map((_, index) => dna.map((row) => row[index]).join(''))

  const diagonals = extractDiagonals(dna)

  const sequences = [...rows, ...columns, ...diagonals]

  return sequences.some((line) => SEQUENCE_REGEX.test(line))
}

/**
 * Extracts diagonal sequences (left-to-right and right-to-left) from a DNA matrix.
 *
 * @param dna - DNA sequence represented as an array of strings.
 * @returns Array of diagonal strings from the DNA matrix.
 */
export const extractDiagonals = (dna: Dna) => {
  const diagonals: string[] = []
  const matrixSize = dna.length

  for (let i = 0; i <= matrixSize - 4; i++) {
    const diag1 = dna
      .slice(i)
      .map((row, index) => row[index] ?? '')
      .join('')
    const diag2 = dna
      .slice(i)
      .map((row, index) => row[matrixSize - 1 - index] ?? '')
      .join('')
    diagonals.push(diag1, diag2)
  }

  for (let i = 1; i <= matrixSize - 4; i++) {
    const diag1 = dna
      .map((row, index) => row[i + index] ?? '')
      .slice(0, matrixSize - i)
      .join('')
    const diag2 = dna
      .map((row, index) => row[matrixSize - 1 - i - index] ?? '')
      .slice(0, matrixSize - i)
      .join('')
    diagonals.push(diag1, diag2)
  }

  return diagonals
}
