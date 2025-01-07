using Application.Common;

namespace Tests.IntegrationTests;

public class BaseIntegrationTest : IAsyncLifetime
{
    protected readonly IntegrationWebApplicationFactory<Program> _factory;
    protected readonly HttpClient _client;
    private void DeleteTestFiles()
    {
        Environment.SetEnvironmentVariable("IS_TEST", "true");
        foreach (string file in Directory.GetFiles(DirectoryService.GetMediaDirectory()))
        {
            if (file.Contains("include-this.txt"))
            {
                // keep this file for github
                continue;
            }

            File.Delete(file);
        }
    }

    public BaseIntegrationTest()
    {
        _factory = new IntegrationWebApplicationFactory<Program>();
        _client = _factory.CreateClient();

        // Delete saved test files before every run
        // (If last run somehow caused an error.)
        DeleteTestFiles();
    }

    public virtual async Task InitializeAsync()
    {
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        if (_client != null)
        {
            _client.Dispose();
        }
        if (_factory != null)
        {
            await _factory.DisposeAsync();
        }

        // Delete saved test files after all tests have finished
        DeleteTestFiles();
    }

    public Mixins GetMixins()
    {
        var db = _factory.CreateDbContext();
        var mixins = new Mixins(db);
        return mixins;
    }
}