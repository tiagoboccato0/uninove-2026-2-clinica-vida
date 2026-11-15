using ClinicaVida.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace ClinicaVida.Web.Controllers;

public class MedicosController : Controller
{
    public IActionResult Index(int? especialidadeId)
    {
        if (!ModelState.IsValid) return BadRequest("Especialidade inválida.");

        var medicos = ClinicaEmMemoria.Medicos.AsEnumerable();
        if (especialidadeId is not null)
        {
            medicos = medicos.Where(m => m.EspecialidadeId == especialidadeId);
        }

        ViewBag.Especialidades = ClinicaEmMemoria.Especialidades;
        ViewBag.EspecialidadeSelecionada = especialidadeId;
        return View(medicos.OrderBy(m => m.Nome).ToList());
    }

    public IActionResult Details(int id)
    {
        var medico = ClinicaEmMemoria.Medicos.FirstOrDefault(m => m.Id == id);
        if (medico is null) return NotFound();

        // Monta o detalhe sem modificar os objetos compartilhados da lista estática.
        var detalhe = new Medico
        {
            Id = medico.Id,
            Nome = medico.Nome,
            Crm = medico.Crm,
            EspecialidadeId = medico.EspecialidadeId,
            Especialidade = ClinicaEmMemoria.Especialidades
                .FirstOrDefault(e => e.Id == medico.EspecialidadeId)
        };
        return View(detalhe);
    }
}
