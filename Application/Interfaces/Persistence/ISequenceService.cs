namespace Application.Interfaces.Persistence;

public interface ISequenceService
{
    Task<int> GetNextValueAsync(string sequenceId);
    Task<int> GetNextOrderValueAsync();
    Task<int> GetNextOrderItemValueAsync();
}