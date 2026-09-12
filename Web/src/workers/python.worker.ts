import {
  loadPyodide,
  version,
} from 'pyodide'

interface RunPythonRequest {
  code: string
}

interface RunPythonResponse {
  success: boolean
  output: string
  error: string | null
}

let runtimePromise:
  ReturnType<typeof loadPyodide> | null = null

function getRuntime() {
  if (!runtimePromise) {
    runtimePromise = loadPyodide({
      indexURL:
        `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
    })
  }

  return runtimePromise
}

self.onmessage = async (
  event: MessageEvent<RunPythonRequest>
) => {
  const output: string[] = []
  const errors: string[] = []

  try {
    const pyodide = await getRuntime()

    pyodide.setStdout({
      batched: (text: string) => {
        output.push(text)
      },
    })

    pyodide.setStderr({
      batched: (text: string) => {
        errors.push(text)
      },
    })

    await pyodide.runPythonAsync(
      event.data.code
    )

    const response: RunPythonResponse = {
      success: true,
      output: output.join('\n'),
      error:
        errors.length > 0
          ? errors.join('\n')
          : null,
    }

    self.postMessage(response)
  } catch (error) {
    const response: RunPythonResponse = {
      success: false,
      output: output.join('\n'),
      error:
        error instanceof Error
          ? error.message
          : String(error),
    }

    self.postMessage(response)
  }
}
