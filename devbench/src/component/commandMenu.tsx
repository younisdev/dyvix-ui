import { DyvixCommandMenu } from '../../../src';
import type { DyvixCommand } from '../../../src';

export function CommandMenuTest() {
  return (
    <>
      <DyvixCommandMenu
        commands={[
          {
            name: 'ping',
            description:
              'Tests network round-trip response and echoes arguments',
            usage: 'ping',
            execute: (_, context) => {
              context.printOutput(`pinged`, 'Log');
            }
          }
        ]}
      />
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          background: '#111',
          border: '1px solid #333'
        }}
      >
        <button
          onClick={() => {
            console.log('System diagnostics nominal. Node active.');
          }}
        >
          Test Log
        </button>

        <button
          onClick={() =>
            console.warn('Low memory buffer warning on thread 04.')
          }
        >
          Test Warn
        </button>

        <button
          onClick={() =>
            console.error('Segmentation fault in rendering pipeline.')
          }
        >
          Test Error
        </button>

        <button
          onClick={() => {
            (window as any).nonExistentFunction();
          }}
        >
          Test Crash
        </button>

        <button
          onClick={() => {
            Promise.reject(
              new Error('Async socket connection timeout (Port 8080)')
            );
          }}
        >
          Test Rejection
        </button>
      </div>
    </>
  );
}
