/**
 * Calculează media notelor omitând cea mai mică și cea mai mare notă
 * Conform cerințelor: nota totală se calculează omitând cea mai mare și cea mai mică notă
 * Dacă sunt mai puțin de 3 note, calculează media simplă
 * @param {Array<Object>} grades - Array de obiecte note cu proprietatea 'value'
 * @returns {number|null} Media calculată cu 2 zecimale sau null dacă nu sunt note
 */
function calculateAverageGrade(grades) {
  if (!grades || grades.length === 0) {
    return null;
  }

  const values = grades.map(g => parseFloat(g.value));

  if (values.length < 3) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return parseFloat((sum / values.length).toFixed(2));
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  const filtered = [...values];
  const minIndex = filtered.indexOf(min);
  filtered.splice(minIndex, 1);
  const maxIndex = filtered.indexOf(max);
  filtered.splice(maxIndex, 1);

  const sum = filtered.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / filtered.length).toFixed(2));
}

module.exports = { calculateAverageGrade };
