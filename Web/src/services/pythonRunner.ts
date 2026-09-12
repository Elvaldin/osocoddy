export interface BrowserPythonResult {
  success: boolean
  output: string
  error: string | null
}

let pythonWorker: Worker | null = null
let runtimeLoaded = false

function getWorker() {
  if (!pythonWorker) {
    pythonWorker = new Worker(
      new URL(
        '../workers/python.worker.ts',
        import.meta.url
      ),
      {
        type: 'module',
      }
    )
  }

  return pythonWorker
}

export function runPythonInBrowser(
  code: string
): Promise<BrowserPythonResult> {
  return new Promise((resolve) => {
    const worker = getWorker()

    const timeoutMilliseconds =
      runtimeLoaded ? 5000 : 30000

    const timeoutId = window.setTimeout(() => {
      worker.terminate()

      if (pythonWorker === worker) {
        pythonWorker = null
      }

      runtimeLoaded = false

      resolve({
        success: false,
        output: '',
        error: 'Tiempo de ejecución excedido.',
      })
    }, timeoutMilliseconds)

    worker.onmessage = (
      event: MessageEvent<BrowserPythonResult>
    ) => {
      window.clearTimeout(timeoutId)
      runtimeLoaded = true
      resolve(event.data)
    }

    worker.onerror = (event: ErrorEvent) => {
      window.clearTimeout(timeoutId)
      worker.terminate()

      if (pythonWorker === worker) {
        pythonWorker = null
      }

      runtimeLoaded = false

      resolve({
        success: false,
        output: '',
        error:
          event.message ||
          'No fue posible iniciar Python.',
      })
    }

    worker.postMessage({
      code,
    })
  })
}
