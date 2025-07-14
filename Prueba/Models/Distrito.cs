using System.ComponentModel.DataAnnotations;

namespace Prueba.Models
{
    public class Distrito
    {
        public int Id { get; set; }

        public int? IdProvincia { get; set; }

        [StringLength(500)]
        public string? NombreDistrito { get; set; }

        public virtual Provincia? Provincia { get; set; }
        public virtual ICollection<Trabajador> Trabajadores { get; set; } = new List<Trabajador>();
    }
}