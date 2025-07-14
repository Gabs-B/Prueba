using Microsoft.EntityFrameworkCore;
using Prueba.Models;

namespace Prueba.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Departamento> Departamentos { get; set; }
        public DbSet<Provincia> Provincias { get; set; }
        public DbSet<Distrito> Distritos { get; set; }
        public DbSet<Trabajador> Trabajadores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Departamento>(entity =>
            {
                entity.ToTable("Departamento");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<Provincia>(entity =>
            {
                entity.ToTable("Provincia");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(d => d.Departamento)
                    .WithMany(p => p.Provincias)
                    .HasForeignKey(d => d.IdDepartamento);
            });

            modelBuilder.Entity<Distrito>(entity =>
            {
                entity.ToTable("Distrito");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(d => d.Provincia)
                    .WithMany(p => p.Distritos)
                    .HasForeignKey(d => d.IdProvincia);
            });

            modelBuilder.Entity<Trabajador>(entity =>
            {
                entity.ToTable("Trabajadores");
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(d => d.Departamento)
                    .WithMany(p => p.Trabajadores)
                    .HasForeignKey(d => d.IdDepartamento);
                entity.HasOne(d => d.Provincia)
                    .WithMany(p => p.Trabajadores)
                    .HasForeignKey(d => d.IdProvincia);
                entity.HasOne(d => d.Distrito)
                    .WithMany(p => p.Trabajadores)
                    .HasForeignKey(d => d.IdDistrito);
            });
        }
    }
}