using Microsoft.AspNetCore.Mvc;

namespace ClinicaVida.Web.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
