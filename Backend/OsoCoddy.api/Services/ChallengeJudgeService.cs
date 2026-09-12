using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace OsoCoddy.Api.Services;

public record ChallengeJudgeResult(
    bool Supported,
    bool Correct,
    string Message,
    string Output,
    string? Error
);

public class ChallengeJudgeService
{
    public Task<ChallengeJudgeResult> CheckAsync(
        string courseSlug,
        int lessonId,
        string code
    )
    {
        return Task.FromResult(
            Check(courseSlug, lessonId, code)
        );
    }

    private static ChallengeJudgeResult Check(
        string courseSlug,
        int lessonId,
        string code
    )
    {
        if (
            !courseSlug.Equals(
                "python",
                StringComparison.OrdinalIgnoreCase
            ) ||
            lessonId < 1 ||
            lessonId > 12
        )
        {
            return new ChallengeJudgeResult(
                Supported: false,
                Correct: false,
                Message:
                    "Este reto todavía no tiene un juez configurado.",
                Output: "",
                Error: null
            );
        }

        if (string.IsNullOrWhiteSpace(code))
        {
            return Wrong(
                "Debes escribir una solución."
            );
        }

        return lessonId switch
        {
            1 => CheckLesson1(code),
            2 => CheckLesson2(code),
            3 => CheckRequirements(
                code,
                "Crea las variables lenguaje y nivel y muestra sus valores con print().",
                @"^\s*lenguaje\s*=\s*[""'][^""'\r\n]+[""']",
                @"^\s*nivel\s*=\s*[""'][^""'\r\n]+[""']",
                @"\bprint\s*\([^)]*\blenguaje\b",
                @"\bprint\s*\([^)]*\bnivel\b"
            ),
            4 => CheckRequirements(
                code,
                "Crea nombre, edad, precio y activo usando los tipos de datos correctos.",
                @"^\s*nombre\s*=\s*[""'][^""'\r\n]+[""']",
                @"^\s*edad\s*=\s*-?\d+\s*$",
                @"^\s*precio\s*=\s*-?\d+(?:\.\d+)?\s*$",
                @"^\s*activo\s*=\s*(?:True|False)\s*$"
            ),
            5 => CheckRequirements(
                code,
                "Usa if y else para comprobar la edad y mostrar el resultado correcto.",
                @"^\s*edad\s*=\s*20\s*$",
                @"\bif\b[^:\r\n]*:",
                @"\belse\s*:",
                @"Mayor de edad",
                @"Menor de edad"
            ),
            6 => CheckRequirements(
                code,
                "Usa un bucle for para mostrar exactamente los números del 1 al 5.",
                @"\bfor\s+\w+\s+in\s+range\s*\(\s*1\s*,\s*6\s*\)\s*:",
                @"\bprint\s*\("
            ),
            7 => CheckRequirements(
                code,
                "Usa un bucle while para mostrar exactamente los números del 1 al 5.",
                @"^\s*numero\s*=\s*1\s*$",
                @"\bwhile\s+numero\s*<=\s*5\s*:",
                @"\bprint\s*\(\s*numero\s*\)",
                @"numero\s*(?:\+=\s*1|=\s*numero\s*\+\s*1)"
            ),
            8 => CheckRequirements(
                code,
                "La función saludar debe recibir un nombre y devolver 'Hola, ' seguido del nombre.",
                @"\bdef\s+saludar\s*\(\s*nombre\s*\)\s*:",
                @"\breturn\b[^\r\n]*\bnombre\b",
                @"Hola"
            ),
            9 => CheckRequirements(
                code,
                "Debes crear una clase llamada Persona.",
                @"^\s*class\s+Persona\s*(?:\([^)]*\))?\s*:"
            ),
            10 => CheckRequirements(
                code,
                "Crea persona1 como objeto de Persona y asigna 'Coddy' a persona1.nombre.",
                @"^\s*class\s+Persona\s*(?:\([^)]*\))?\s*:",
                @"^\s*persona1\s*=\s*Persona\s*\(\s*\)\s*$",
                @"^\s*persona1\.nombre\s*=\s*[""']Coddy[""']\s*$"
            ),
            11 => CheckRequirements(
                code,
                "El constructor debe guardar nombre y edad en el objeto.",
                @"^\s*class\s+Persona\s*(?:\([^)]*\))?\s*:",
                @"\bdef\s+__init__\s*\(\s*self\s*,\s*nombre\s*,\s*edad\s*\)\s*:",
                @"self\.nombre\s*=\s*nombre",
                @"self\.edad\s*=\s*edad"
            ),
            12 => CheckRequirements(
                code,
                "El método saludar() debe devolver 'Hola, ' seguido del nombre del objeto.",
                @"^\s*class\s+Persona\s*(?:\([^)]*\))?\s*:",
                @"\bdef\s+__init__\s*\(\s*self\s*,\s*nombre\s*\)\s*:",
                @"self\.nombre\s*=\s*nombre",
                @"\bdef\s+saludar\s*\(\s*self\s*\)\s*:",
                @"\breturn\b[^\r\n]*self\.nombre",
                @"Hola"
            ),
            _ => Wrong(
                "Este reto todavía no está disponible."
            )
        };
    }

    private static ChallengeJudgeResult CheckLesson1(
        string code
    )
    {
        var hasPersonalMessage = Has(
            code,
            @"\bprint\s*\(\s*[""'][^""'\r\n]*[A-Za-zÁÉÍÓÚáéíóúÑñ][^""'\r\n]*[""']\s*\)"
        );

        var stillUsesExample = code.Contains(
            "osoCoddy",
            StringComparison.OrdinalIgnoreCase
        );

        return hasPersonalMessage && !stillUsesExample
            ? Correct()
            : Wrong(
                "Modifica el print para que muestre tu nombre."
            );
    }

    private static ChallengeJudgeResult CheckLesson2(
        string code
    )
    {
        var correct =
            Has(code, @"\bprint\s*\(") &&
            code.Contains(
                "Estoy aprendiendo Python en osoCoddy.",
                StringComparison.Ordinal
            );

        return correct
            ? Correct()
            : Wrong(
                "La salida debe mostrar exactamente: Estoy aprendiendo Python en osoCoddy."
            );
    }

    private static ChallengeJudgeResult CheckRequirements(
        string code,
        string errorMessage,
        params string[] patterns
    )
    {
        foreach (var pattern in patterns)
        {
            if (!Has(code, pattern))
            {
                return Wrong(errorMessage);
            }
        }

        return Correct();
    }

    private static bool Has(
        string code,
        string pattern
    )
    {
        return Regex.IsMatch(
            code,
            pattern,
            RegexOptions.IgnoreCase |
            RegexOptions.Multiline |
            RegexOptions.CultureInvariant
        );
    }

    private static ChallengeJudgeResult Correct()
    {
        return new ChallengeJudgeResult(
            Supported: true,
            Correct: true,
            Message: "¡Reto correcto! 🎉",
            Output: "",
            Error: null
        );
    }

    private static ChallengeJudgeResult Wrong(
        string message
    )
    {
        return new ChallengeJudgeResult(
            Supported: true,
            Correct: false,
            Message: message,
            Output: "",
            Error: null
        );
    }
}
