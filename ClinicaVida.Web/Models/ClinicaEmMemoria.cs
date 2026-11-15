namespace ClinicaVida.Web.Models;

// Dados fictícios usados somente no laboratório, sem banco de dados.
public static class ClinicaEmMemoria
{
    public static List<Especialidade> Especialidades { get; } = new()
    {
        new() { Id = 1, Nome = "Cardiologia", Descricao = "Cuidados com o coração e os vasos sanguíneos." },
        new() { Id = 2, Nome = "Pediatria", Descricao = "Acompanhamento da saúde de crianças e adolescentes." },
        new() { Id = 3, Nome = "Dermatologia", Descricao = "Cuidados com a pele, os cabelos e as unhas." },
        new() { Id = 4, Nome = "Ortopedia", Descricao = "Cuidados com ossos, músculos e articulações." },
        new() { Id = 5, Nome = "Ginecologia", Descricao = "Acompanhamento da saúde da mulher." },
        new() { Id = 6, Nome = "Clínica Geral", Descricao = "Atendimento geral e orientação sobre a saúde." }
    };

    public static List<Medico> Medicos { get; } = new()
    {
        new() { Id = 1, Nome = "Ana Prado", Crm = "112233", EspecialidadeId = 1 },
        new() { Id = 2, Nome = "Marta Lisboa", Crm = "55307", EspecialidadeId = 1 },
        new() { Id = 3, Nome = "Caio Nunes", Crm = "41880", EspecialidadeId = 2 },
        new() { Id = 4, Nome = "Luiza Alves", Crm = "66778", EspecialidadeId = 2 },
        new() { Id = 5, Nome = "Bruno Lima", Crm = "77889", EspecialidadeId = 3 },
        new() { Id = 6, Nome = "Rafael Costa", Crm = "88990", EspecialidadeId = 4 }
    };
}
