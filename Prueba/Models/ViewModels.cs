using System.ComponentModel.DataAnnotations;
namespace Prueba.Models
{
    public class TrabajadorViewModel
    {
        public int Id { get; set; }
        [Display(Name = "Tipo de Documento")]
        public string? TipoDocumento { get; set; }
        [Display(Name = "Número de Documento")]
        public string? NumeroDocumento { get; set; }
        [Display(Name = "Nombres")]
        public string? Nombres { get; set; }
        [Display(Name = "Sexo")]
        public string? Sexo { get; set; }
        [Display(Name = "Departamento")]
        public int? IdDepartamento { get; set; }
        [Display(Name = "Provincia")]
        public int? IdProvincia { get; set; }
        [Display(Name = "Distrito")]
        public int? IdDistrito { get; set; }
        public string? NombreDepartamento { get; set; }
        public string? NombreProvincia { get; set; }
        public string? NombreDistrito { get; set; }
    }

    public class TrabajadorCreateViewModel
    {
        [Display(Name = "Tipo de Documento")]
        [Required(ErrorMessage = "El tipo de documento es obligatorio")]
        public string? TipoDocumento { get; set; }

        [Display(Name = "Número de Documento")]
        [Required(ErrorMessage = "El número de documento es obligatorio")]
        public string? NumeroDocumento { get; set; }

        [Display(Name = "Nombres")]
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string? Nombres { get; set; }

        [Display(Name = "Sexo")]
        [Required(ErrorMessage = "El sexo es obligatorio")]

        public string? Sexo { get; set; }

        [Display(Name = "Departamento")]
        [Required(ErrorMessage = "El departamento es obligatorio")]
        public int? IdDepartamento { get; set; }

        [Display(Name = "Provincia")]
        [Required(ErrorMessage = "La provincia es obligatoria")]
        public int? IdProvincia { get; set; }

        [Display(Name = "Distrito")]
        [Required(ErrorMessage = "El distrito es obligatorio")]
        public int? IdDistrito { get; set; }
    }

    public class TrabajadorEditViewModel
    {
        public int Id { get; set; }

        [Display(Name = "Tipo de Documento")]
        [Required(ErrorMessage = "El tipo de documento es obligatorio")]
        public string? TipoDocumento { get; set; }

        [Display(Name = "Número de Documento")]
        [Required(ErrorMessage = "El número de documento es obligatorio")]
        public string? NumeroDocumento { get; set; }

        [Display(Name = "Nombres")]
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string? Nombres { get; set; }

        [Display(Name = "Sexo")]
        [Required(ErrorMessage = "El sexo es obligatorio")]

        public string? Sexo { get; set; }

        [Display(Name = "Departamento")]
        [Required(ErrorMessage = "El departamento es obligatorio")]
        public int? IdDepartamento { get; set; }

        [Display(Name = "Provincia")]
        [Required(ErrorMessage = "La provincia es obligatoria")]
        public int? IdProvincia { get; set; }

        [Display(Name = "Distrito")]
        [Required(ErrorMessage = "El distrito es obligatorio")]
        public int? IdDistrito { get; set; }
    }
}