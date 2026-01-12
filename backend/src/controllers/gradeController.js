const gradeService = require('../services/gradeService');

// controller pentru note
class GradeController {
  // handler pentru trimitere nota noua
  async submitGrade(req, res) {
    try {
      const { projectId, deliverableId, value } = req.body;

      if (!projectId || !deliverableId || value === undefined) {
        return res.status(400).json({ 
          error: 'projectId, deliverableId și value sunt obligatorii' 
        });
      }

      const grade = await gradeService.submitGrade(
        req.user.id,
        parseInt(projectId),
        parseInt(deliverableId),
        parseFloat(value)
      );

      res.status(201).json({
        message: 'Notă adăugată cu succes',
        grade: {
          id: grade.id,
          value: parseFloat(grade.value),
          createdAt: grade.createdAt
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // handler pentru update nota existenta
  async updateGrade(req, res) {
    try {
      const { id } = req.params;
      const { value } = req.body;

      if (value === undefined) {
        return res.status(400).json({ error: 'value este obligatoriu' });
      }

      const grade = await gradeService.updateGrade(
        parseInt(id),
        req.user.id,
        parseFloat(value)
      );

      res.json({
        message: 'Notă actualizată cu succes',
        grade: {
          id: grade.id,
          value: parseFloat(grade.value),
          updatedAt: grade.updatedAt
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // handler pentru sumar note proiect, doar profesori
  async getGradesSummary(req, res) {
    try {
      const { id } = req.params;

      const summary = await gradeService.getGradesSummary(parseInt(id));

      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GradeController();
