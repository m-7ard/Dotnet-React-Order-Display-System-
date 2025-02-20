namespace Application.Interfaces.Persistence;

public interface IUnitOfWork
{
    public Task SaveAsync();
}