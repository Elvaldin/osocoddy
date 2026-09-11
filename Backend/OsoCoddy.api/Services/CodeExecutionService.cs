using System.Diagnostics;

namespace OsoCoddy.Api.Services;

public record CodeExecutionResult(
    bool Success,
    string Output,
    string Error,
    bool TimedOut
);

public class CodeExecutionService
{
    public async Task<CodeExecutionResult> RunPythonAsync(
        string code
    )
    {
        var startInfo = new ProcessStartInfo
        {
            FileName = "docker",

            RedirectStandardInput = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,

            UseShellExecute = false,
            CreateNoWindow = true
        };

        startInfo.ArgumentList.Add("run");
        startInfo.ArgumentList.Add("--rm");
        startInfo.ArgumentList.Add("-i");

        // Sin acceso a Internet
        startInfo.ArgumentList.Add("--network");
        startInfo.ArgumentList.Add("none");

        // Límites
        startInfo.ArgumentList.Add("--memory");
        startInfo.ArgumentList.Add("128m");

        startInfo.ArgumentList.Add("--cpus");
        startInfo.ArgumentList.Add("0.5");

        startInfo.ArgumentList.Add("--pids-limit");
        startInfo.ArgumentList.Add("64");

        // Seguridad
        startInfo.ArgumentList.Add("--read-only");

        startInfo.ArgumentList.Add("--cap-drop");
        startInfo.ArgumentList.Add("ALL");

        startInfo.ArgumentList.Add("--security-opt");
        startInfo.ArgumentList.Add(
            "no-new-privileges"
        );

        startInfo.ArgumentList.Add("--tmpfs");
        startInfo.ArgumentList.Add(
            "/tmp:rw,noexec,nosuid,size=16m"
        );

        startInfo.ArgumentList.Add("--user");
        startInfo.ArgumentList.Add(
            "65534:65534"
        );

        // Python
        startInfo.ArgumentList.Add(
            "python:3.13-alpine"
        );

        startInfo.ArgumentList.Add("python");
        startInfo.ArgumentList.Add("-I");
        startInfo.ArgumentList.Add("-B");
        startInfo.ArgumentList.Add("-u");
        startInfo.ArgumentList.Add("-");


        using var process = new Process
        {
            StartInfo = startInfo
        };

        try
        {
            process.Start();

            await process.StandardInput.WriteAsync(
                code
            );

            process.StandardInput.Close();

            var outputTask =
                process.StandardOutput
                    .ReadToEndAsync();

            var errorTask =
                process.StandardError
                    .ReadToEndAsync();

            using var timeout =
                new CancellationTokenSource(
                    TimeSpan.FromSeconds(3)
                );

            try
            {
                await process.WaitForExitAsync(
                    timeout.Token
                );
            }
            catch (OperationCanceledException)
            {
                try
                {
                    process.Kill(
                        entireProcessTree: true
                    );
                }
                catch
                {
                }

                return new CodeExecutionResult(
                    Success: false,
                    Output: "",
                    Error:
                        "Tiempo de ejecución excedido.",
                    TimedOut: true
                );
            }

            var output =
                await outputTask;

            var error =
                await errorTask;

            return new CodeExecutionResult(
                Success: process.ExitCode == 0,
                Output: output,
                Error: error,
                TimedOut: false
            );
        }
        catch
        {
            return new CodeExecutionResult(
                Success: false,
                Output: "",
                Error:
                    "No fue posible iniciar Docker.",
                TimedOut: false
            );
        }
    }
}