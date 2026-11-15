# Atividade IV — C# e LINQ

Projeto ASP.NET Core MVC em `ClinicaVida.Web`, usando .NET 8. Os médicos e CRMs são dados fictícios de laboratório. As listas ficam em memória; não há banco de dados, cadastro de pacientes nem agendamento implementado nesta etapa.

## Executar

Com o SDK .NET 8 instalado, na raiz do repositório:

```sh
dotnet build ClinicaVida.Web/ClinicaVida.Web.csproj
dotnet run --project ClinicaVida.Web --urls http://localhost:5080
```

Abra http://localhost:5080. A aplicação usa HTTP somente para a demonstração local; uma publicação com dados de pacientes exige HTTPS e outras proteções.

## Conferir

- `/Medicos`: seis médicos em ordem alfabética.
- `/Medicos?especialidadeId=1`: Ana Prado e Marta Lisboa, da Cardiologia.
- `/Medicos?especialidadeId=2`: Caio Nunes e Luiza Alves, da Pediatria.
- `/Medicos?especialidadeId=5`: mensagem de lista vazia.
- `/Medicos/Details/1`: nome, CRM e nome da especialidade.
- `/Medicos/Details/999`: HTTP 404.
- `/Especialidades`: seis especialidades, com contagens 2, 2, 1, 1, 0 e 0, e links para o filtro.

As seis especialidades preservam a lista da atividade II e superam o mínimo de quatro. Duas especialidades possuem dois médicos cada, como pedido no laboratório.

## Como o código está dividido

- `Models/Especialidade.cs` e `Models/Medico.cs`: propriedades dos dados.
- `Models/ClinicaEmMemoria.cs`: fonte única com as listas.
- `MedicosController.Index`: filtra com `Where` e ordena com `OrderBy`.
- `MedicosController.Details`: procura com `FirstOrDefault` e retorna `NotFound()` quando necessário.
- `EspecialidadesController.Index`: preenche um `Dictionary<int, int>` com a contagem de médicos.
- Views de médicos e especialidades: recebem dados tipados por `@model`.

## Testes reproduzíveis

Com a aplicação aberta em `http://127.0.0.1:5080`, e Node.js 18 ou superior:

```sh
node tests/medicos-http.mjs
```

Em 15/11/2026, o build com SDK 8.0.428 terminou com zero avisos e zero erros. Os 14 testes HTTP passaram. Eles verificam o HTML realmente devolvido pela aplicação e os códigos de status, incluindo filtro vazio, filtro malformado (400), médico inexistente e contagem zero.
