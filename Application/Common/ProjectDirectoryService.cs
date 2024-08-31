using System.Reflection;

namespace Application.Common;

public class DirectoryService
{
    public static string GetProjectRoot()
    {
        var assembly = Assembly.GetCallingAssembly();
        var dir = new DirectoryInfo(assembly.Location);
        while (dir!.Name != "SimpleProductOrderingService")
        {
            dir = Directory.GetParent(dir.FullName);
        }

        return dir!.FullName;
    }

    public static string GetMediaDirectory()
    {
        var projectRoot = GetProjectRoot();
        var appRoot = Path.Join(projectRoot, "Files");
        if (Environment.GetEnvironmentVariable("IS_TEST") == "true")
        {
            return Path.Join(appRoot, "Media/Tests");
        }

        return Path.Join(appRoot, "Media");
    }
}