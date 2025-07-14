using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using System.Data;
using Prueba.Data;
using Prueba.Models;

namespace TrabajadoresApp.Controllers
{
    public class TrabajadoresController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TrabajadoresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Trabajadores - Usando Stored Procedure
        public async Task<IActionResult> Index(string? sexo)
        {
            var trabajadores = new List<TrabajadorViewModel>();

            try
            {
                var sexoParam = new SqlParameter("@Sexo", SqlDbType.VarChar, 1)
                {
                    Value = string.IsNullOrEmpty(sexo) ? DBNull.Value : sexo
                };

                var results = await _context.Database
                    .SqlQueryRaw<TrabajadorViewModel>("EXEC SP_ListarTrabajadores @Sexo", sexoParam)
                    .ToListAsync();

                trabajadores = results;
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error al cargar la lista de trabajadores: " + ex.Message;
            }

            ViewBag.FiltroSexo = sexo;
            return View(trabajadores);
        }

        // GET: Trabajadores/Create
        public IActionResult Create()
        {
            ViewBag.Departamentos = new SelectList(_context.Departamentos, "Id", "NombreDepartamento");
            ViewBag.Provincias = new SelectList(new List<Provincia>(), "Id", "NombreProvincia");
            ViewBag.Distritos = new SelectList(new List<Distrito>(), "Id", "NombreDistrito");
            return PartialView("_CreateModal");
        }

        // POST: Trabajadores/Create - Usando Stored Procedure
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(TrabajadorCreateViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var parameters = new[]
                    {
                        new SqlParameter("@TipoDocumento", SqlDbType.VarChar, 3) { Value = model.TipoDocumento ?? (object)DBNull.Value },
                        new SqlParameter("@NumeroDocumento", SqlDbType.VarChar, 50) { Value = model.NumeroDocumento ?? (object)DBNull.Value },
                        new SqlParameter("@Nombres", SqlDbType.VarChar, 500) { Value = model.Nombres },
                        new SqlParameter("@Sexo", SqlDbType.VarChar, 1) { Value = model.Sexo ?? (object)DBNull.Value },
                        new SqlParameter("@IdDepartamento", SqlDbType.Int) { Value = model.IdDepartamento ?? (object)DBNull.Value },
                        new SqlParameter("@IdProvincia", SqlDbType.Int) { Value = model.IdProvincia ?? (object)DBNull.Value },
                        new SqlParameter("@IdDistrito", SqlDbType.Int) { Value = model.IdDistrito ?? (object)DBNull.Value }
                    };

                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC SP_InsertarTrabajador @TipoDocumento, @NumeroDocumento, @Nombres, @Sexo, @IdDepartamento, @IdProvincia, @IdDistrito",
                        parameters);

                    TempData["Success"] = "Trabajador creado exitosamente";
                    return Json(new { success = true, message = "Trabajador creado exitosamente" });
                }
                catch (Exception ex)
                {
                    TempData["Error"] = "Error al crear el trabajador: " + ex.Message;
                    return Json(new { success = false, message = "Error al crear el trabajador" });
                }
            }

            ViewBag.Departamentos = new SelectList(_context.Departamentos, "Id", "NombreDepartamento", model.IdDepartamento);
            ViewBag.Provincias = new SelectList(_context.Provincias.Where(p => p.IdDepartamento == model.IdDepartamento), "Id", "NombreProvincia", model.IdProvincia);
            ViewBag.Distritos = new SelectList(_context.Distritos.Where(d => d.IdProvincia == model.IdProvincia), "Id", "NombreDistrito", model.IdDistrito);

            return PartialView("_CreateModal", model);
        }

        // GET: Trabajadores/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            try
            {
                var idParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

                var resultados = await _context.Database
                    .SqlQueryRaw<TrabajadorViewModel>("EXEC SP_ObtenerTrabajadorPorId @Id", idParam)
                    .ToListAsync();

                var trabajador = resultados.FirstOrDefault();

                if (trabajador == null) return NotFound();

                var model = new TrabajadorEditViewModel
                {
                    Id = trabajador.Id,
                    TipoDocumento = trabajador.TipoDocumento,
                    NumeroDocumento = trabajador.NumeroDocumento,
                    Nombres = trabajador.Nombres,
                    Sexo = trabajador.Sexo,
                    IdDepartamento = trabajador.IdDepartamento,
                    IdProvincia = trabajador.IdProvincia,
                    IdDistrito = trabajador.IdDistrito
                };

                ViewBag.Departamentos = new SelectList(_context.Departamentos, "Id", "NombreDepartamento", model.IdDepartamento);

                var provincias = model.IdDepartamento.HasValue
                    ? await _context.Provincias.Where(p => p.IdDepartamento == model.IdDepartamento).ToListAsync()
                    : new List<Provincia>();
                ViewBag.Provincias = new SelectList(provincias, "Id", "NombreProvincia", model.IdProvincia);

                var distritos = model.IdProvincia.HasValue
                    ? await _context.Distritos.Where(d => d.IdProvincia == model.IdProvincia).ToListAsync()
                    : new List<Distrito>();
                ViewBag.Distritos = new SelectList(distritos, "Id", "NombreDistrito", model.IdDistrito);

                return PartialView("_EditModal", model);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error al obtener el trabajador: " + ex.Message });
            }
        }

        // POST: Trabajadores/Edit/5 - Usando Stored Procedure
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(TrabajadorEditViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var parameters = new[]
                    {
                        new SqlParameter("@Id", SqlDbType.Int) { Value = model.Id },
                        new SqlParameter("@TipoDocumento", SqlDbType.VarChar, 3) { Value = model.TipoDocumento ?? (object)DBNull.Value },
                        new SqlParameter("@NumeroDocumento", SqlDbType.VarChar, 50) { Value = model.NumeroDocumento ?? (object)DBNull.Value },
                        new SqlParameter("@Nombres", SqlDbType.VarChar, 500) { Value = model.Nombres },
                        new SqlParameter("@Sexo", SqlDbType.VarChar, 1) { Value = model.Sexo ?? (object)DBNull.Value },
                        new SqlParameter("@IdDepartamento", SqlDbType.Int) { Value = model.IdDepartamento ?? (object)DBNull.Value },
                        new SqlParameter("@IdProvincia", SqlDbType.Int) { Value = model.IdProvincia ?? (object)DBNull.Value },
                        new SqlParameter("@IdDistrito", SqlDbType.Int) { Value = model.IdDistrito ?? (object)DBNull.Value }
                    };

                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC SP_ActualizarTrabajador @Id, @TipoDocumento, @NumeroDocumento, @Nombres, @Sexo, @IdDepartamento, @IdProvincia, @IdDistrito",
                        parameters);

                    TempData["Success"] = "Trabajador actualizado exitosamente";
                    return Json(new { success = true, message = "Trabajador actualizado exitosamente" });
                }
                catch (Exception ex)
                {
                    TempData["Error"] = "Error al actualizar el trabajador: " + ex.Message;
                    return Json(new { success = false, message = "Error al actualizar el trabajador" });
                }
            }

            ViewBag.Departamentos = new SelectList(_context.Departamentos, "Id", "NombreDepartamento", model.IdDepartamento);

            var provincias = model.IdDepartamento.HasValue
                ? await _context.Provincias.Where(p => p.IdDepartamento == model.IdDepartamento).ToListAsync()
                : new List<Provincia>();
            ViewBag.Provincias = new SelectList(provincias, "Id", "NombreProvincia", model.IdProvincia);

            var distritos = model.IdProvincia.HasValue
                ? await _context.Distritos.Where(d => d.IdProvincia == model.IdProvincia).ToListAsync()
                : new List<Distrito>();
            ViewBag.Distritos = new SelectList(distritos, "Id", "NombreDistrito", model.IdDistrito);

            return PartialView("_EditModal", model);
        }

        // POST: Trabajadores/Delete/5 - Usando Stored Procedure
        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var idParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

                await _context.Database.ExecuteSqlRawAsync("EXEC SP_EliminarTrabajador @Id", idParam);

                TempData["Success"] = "Trabajador eliminado exitosamente";
                return Json(new { success = true, message = "Trabajador eliminado exitosamente" });
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Error al eliminar el trabajador: " + ex.Message;
                return Json(new { success = false, message = "Error al eliminar el trabajador" });
            }
        }

        // API Methods for cascading dropdowns
        [HttpGet]
        public async Task<IActionResult> GetProvincias(int departamentoId)
        {
            var provincias = await _context.Provincias
                .Where(p => p.IdDepartamento == departamentoId)
                .Select(p => new { p.Id, p.NombreProvincia })
                .ToListAsync();

            return Json(provincias);
        }

        [HttpGet]
        public async Task<IActionResult> GetDistritos(int provinciaId)
        {
            var distritos = await _context.Distritos
                .Where(d => d.IdProvincia == provinciaId)
                .Select(d => new { d.Id, d.NombreDistrito })
                .ToListAsync();

            return Json(distritos);
        }
    }
}