using System.ComponentModel.DataAnnotations;

namespace Prueba.Models
{
    public class Trabajador
    {
        public int Id { get; set; }

        [StringLength(3)]
        [Display(Name = "Tipo de Documento")]
        public string? TipoDocumento { get; set; }

        [StringLength(50)]
        [Display(Name = "Número de Documento")]
        public string? NumeroDocumento { get; set; }

        [StringLength(500)]
        [Display(Name = "Nombres")]
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string? Nombres { get; set; }

        [StringLength(1)]
        [Display(Name = "Sexo")]
        public string? Sexo { get; set; }

        [Display(Name = "Departamento")]
        public int? IdDepartamento { get; set; }

        [Display(Name = "Provincia")]
        public int? IdProvincia { get; set; }

        [Display(Name = "Distrito")]
        public int? IdDistrito { get; set; }

        public virtual Departamento? Departamento { get; set; }
        public virtual Provincia? Provincia { get; set; }
        public virtual Distrito? Distrito { get; set; }
    }
}