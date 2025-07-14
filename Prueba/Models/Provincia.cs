using System.ComponentModel.DataAnnotations;

namespace Prueba.Models
{
    public class Provincia
    {
        public int Id { get; set; }

        public int? IdDepartamento { get; set; }

        [StringLength(500)]
        public string? NombreProvincia { get; set; }

        public virtual Departamento? Departamento { get; set; }
        public virtual ICollection<Distrito> Distritos { get; set; } = new List<Distrito>();
        public virtual ICollection<Trabajador> Trabajadores { get; set; } = new List<Trabajador>();
    }
}