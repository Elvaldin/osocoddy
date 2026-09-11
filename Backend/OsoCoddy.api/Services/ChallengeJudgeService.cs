using System.Text.Json;

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
    private readonly CodeExecutionService _executor;

    public ChallengeJudgeService(
        CodeExecutionService executor
    )
    {
        _executor = executor;
    }

    public async Task<ChallengeJudgeResult> CheckAsync(
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


        /*
         * Marcadores secretos diferentes
         * en cada ejecución.
         */
        var markerId =
            Guid.NewGuid().ToString("N");

        var correctMarker =
            $"__OSOCODDY_CORRECT_{markerId}__";

        var wrongMarker =
            $"__OSOCODDY_WRONG_{markerId}__";


        /*
         * Código original convertido
         * a un literal seguro.
         */
        var sourceLiteral =
            JsonSerializer.Serialize(code);


        /*
         * Pruebas ocultas por lección.
         */
        var hiddenTests =
            lessonId switch
            {
                1 => $"""

print("{correctMarker}")

""",

                2 => $"""

print("{correctMarker}")

""",

                3 => $"""

try:
    assert isinstance(lenguaje, str)
    assert len(lenguaje.strip()) > 0

    assert isinstance(nivel, str)
    assert len(nivel.strip()) > 0

    print("{correctMarker}")

except (AssertionError, NameError):
    print("{wrongMarker}")

""",

                4 => $"""

try:
    assert isinstance(nombre, str)
    assert len(nombre.strip()) > 0

    assert type(edad) is int

    assert type(precio) in (int, float)

    assert type(activo) is bool

    print("{correctMarker}")

except (AssertionError, NameError):
    print("{wrongMarker}")

""",

                5 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_if_else = any(
        isinstance(node, ast.If)
        and len(node.orelse) > 0
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_if_else
    assert edad == 20

    print("{correctMarker}")

except (AssertionError, NameError, SyntaxError):
    print("{wrongMarker}")

""",

                6 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_for = any(
        isinstance(node, ast.For)
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_for

    print("{correctMarker}")

except (AssertionError, NameError, SyntaxError):
    print("{wrongMarker}")

""",

                7 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_while = any(
        isinstance(node, ast.While)
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_while

    print("{correctMarker}")

except (AssertionError, NameError, SyntaxError):
    print("{wrongMarker}")

""",

                8 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_function = any(
        isinstance(node, ast.FunctionDef)
        and node.name == "saludar"
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_function

    assert callable(saludar)

    assert (
        saludar("Oswaldo")
        == "Hola, Oswaldo"
    )

    assert (
        saludar("Coddy")
        == "Hola, Coddy"
    )

    print("{correctMarker}")

except (
    AssertionError,
    NameError,
    SyntaxError,
    TypeError
):
    print("{wrongMarker}")

""",

                9 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_persona_class = any(
        isinstance(node, ast.ClassDef)
        and node.name == "Persona"
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_persona_class
    assert isinstance(Persona, type)

    print("{correctMarker}")

except (
    AssertionError,
    NameError,
    SyntaxError
):
    print("{wrongMarker}")

""",

                10 => $"""

try:
    assert isinstance(Persona, type)

    assert isinstance(
        persona1,
        Persona
    )

    assert hasattr(
        persona1,
        "nombre"
    )

    assert persona1.nombre == "Coddy"

    print("{correctMarker}")

except (
    AssertionError,
    NameError,
    AttributeError,
    TypeError
):
    print("{wrongMarker}")

""",

                11 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_init = any(
        isinstance(node, ast.FunctionDef)
        and node.name == "__init__"
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_init

    __test_persona = Persona("Oswaldo", 24)

    assert (
        __test_persona.nombre
        == "Oswaldo"
    )

    assert (
        __test_persona.edad
        == 24
    )

    print("{correctMarker}")

except (
    AssertionError,
    NameError,
    AttributeError,
    TypeError,
    SyntaxError
):
    print("{wrongMarker}")

""",

                12 => $"""

import ast

try:
    __osocoddy_source = {sourceLiteral}
    __osocoddy_tree = ast.parse(__osocoddy_source)

    __has_saludar = any(
        isinstance(node, ast.FunctionDef)
        and node.name == "saludar"
        for node in ast.walk(__osocoddy_tree)
    )

    assert __has_saludar

    __persona1 = Persona("Oswaldo")

    __persona2 = Persona("Coddy")

    assert (
        __persona1.saludar()
        == "Hola, Oswaldo"
    )

    assert (
        __persona2.saludar()
        == "Hola, Coddy"
    )

    print("{correctMarker}")

except (
    AssertionError,
    NameError,
    AttributeError,
    TypeError,
    SyntaxError
):
    print("{wrongMarker}")

""",

                _ => ""
            };


        var codeToExecute =
            code +
            Environment.NewLine +
            hiddenTests;


        /*
         * Ejecutamos mediante nuestro
         * CodeExecutionService.
         */
        var execution =
            await _executor.RunPythonAsync(
                codeToExecute
            );


        if (execution.TimedOut)
        {
            return new ChallengeJudgeResult(
                Supported: true,
                Correct: false,
                Message:
                    "Tu código tardó demasiado en ejecutarse.",
                Output: "",
                Error:
                    "Tiempo de ejecución excedido."
            );
        }


        if (!execution.Success)
        {
            return new ChallengeJudgeResult(
                Supported: true,
                Correct: false,
                Message:
                    "Tu código contiene un error de Python.",
                Output: "",
                Error:
                    execution.Error
            );
        }


        var output =
            execution.Output;


        /*
         * Buscamos el veredicto de
         * las pruebas ocultas.
         */
        var lines =
            output
                .Replace("\r\n", "\n")
                .Split(
                    '\n',
                    StringSplitOptions
                        .RemoveEmptyEntries
                );


        var verdict =
            lines
                .LastOrDefault()?
                .Trim();


        /*
         * Quitamos los marcadores antes
         * de devolver stdout al frontend.
         */
        var studentOutput =
            output
                .Replace(
                    correctMarker,
                    ""
                )
                .Replace(
                    wrongMarker,
                    ""
                )
                .Replace(
                    "\r\n",
                    "\n"
                )
                .Trim();


        var challengeCorrect = false;

        var challengeMessage =
            "Tu código funciona, pero todavía no cumple con todos los requisitos del reto.";


        /*
         * LECCIÓN 1
         */
        if (lessonId == 1)
        {
            challengeCorrect =
                verdict == correctMarker &&
                !string.IsNullOrWhiteSpace(
                    studentOutput
                ) &&
                !studentOutput.Contains(
                    "osoCoddy",
                    StringComparison.OrdinalIgnoreCase
                );

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Modifica el print para que muestre tu nombre.";
            }
        }


        /*
         * LECCIÓN 2
         */
        else if (lessonId == 2)
        {
            challengeCorrect =
                verdict == correctMarker &&
                studentOutput ==
                    "Estoy aprendiendo Python en osoCoddy.";

            if (!challengeCorrect)
            {
                challengeMessage =
                    "La salida todavía no coincide con la frase solicitada.";
            }
        }


        /*
         * LECCIÓN 3
         */
        else if (lessonId == 3)
        {
            var usesPrint =
                code.Contains(
                    "print(",
                    StringComparison.OrdinalIgnoreCase
                );

            challengeCorrect =
                verdict == correctMarker &&
                usesPrint &&
                !string.IsNullOrWhiteSpace(
                    studentOutput
                );

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Crea las variables lenguaje y nivel y muestra sus valores con print().";
            }
        }


        /*
         * LECCIÓN 4
         */
        else if (lessonId == 4)
        {
            challengeCorrect =
                verdict == correctMarker;
        }


        /*
         * LECCIÓN 5
         */
        else if (lessonId == 5)
        {
            challengeCorrect =
                verdict == correctMarker &&
                studentOutput ==
                    "Mayor de edad";

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Usa if y else para comprobar la edad y mostrar el resultado correcto.";
            }
        }


        /*
         * LECCIÓN 6
         */
        else if (lessonId == 6)
        {
            const string expectedOutput =
                "1\n2\n3\n4\n5";

            challengeCorrect =
                verdict == correctMarker &&
                studentOutput ==
                    expectedOutput;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Usa un bucle for para mostrar exactamente los números del 1 al 5.";
            }
        }


        /*
         * LECCIÓN 7
         */
        else if (lessonId == 7)
        {
            const string expectedOutput =
                "1\n2\n3\n4\n5";

            challengeCorrect =
                verdict == correctMarker &&
                studentOutput ==
                    expectedOutput;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Usa un bucle while para mostrar exactamente los números del 1 al 5.";
            }
        }


        /*
         * LECCIÓN 8
         */
        else if (lessonId == 8)
        {
            challengeCorrect =
                verdict == correctMarker;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "La función saludar debe recibir un nombre y devolver 'Hola, ' seguido del nombre.";
            }
        }

        else if (lessonId == 9)
        {
            challengeCorrect =
                verdict == correctMarker;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Debes crear una clase llamada Persona.";
            }
        }

        else if (lessonId == 10)
        {
            challengeCorrect =
                verdict == correctMarker;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "Crea persona1 como objeto de Persona y asigna 'Coddy' a persona1.nombre.";
            }
        }

        else if (lessonId == 11)
        {
            challengeCorrect =
                verdict == correctMarker;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "El constructor debe recibir nombre y edad y guardarlos en self.nombre y self.edad.";
            }
        }

        else if (lessonId == 12)
        {
            challengeCorrect =
                verdict == correctMarker;

            if (!challengeCorrect)
            {
                challengeMessage =
                    "El método saludar() debe devolver 'Hola, ' seguido del nombre del objeto.";
            }
        }

        if (challengeCorrect)
        {
            return new ChallengeJudgeResult(
                Supported: true,
                Correct: true,
                Message:
                    "¡Reto correcto! 🎉",
                Output:
                    studentOutput,
                Error: null
            );
        }


        return new ChallengeJudgeResult(
            Supported: true,
            Correct: false,
            Message:
                challengeMessage,
            Output:
                studentOutput,
            Error: null
        );
    }
}