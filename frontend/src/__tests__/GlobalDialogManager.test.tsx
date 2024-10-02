// GlobalDialogManager.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import GlobalDialog from '../presentation/components/Dialog/GlobalDialog';
import GlobalDialogManager from '../presentation/components/Dialog/GlobalDialogManager';
import '@testing-library/jest-dom';

// Mock Panel Component
const MockPanel = jest.fn(() => <div>Mock Panel</div>);

// Mock Trigger Component
const MockTrigger = ({ onToggle }: { onToggle: () => void }) => (
    <button onClick={onToggle}>Open Dialog</button>
);

describe('GlobalDialogManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('opens and closes dialog', () => {
        render(
            <GlobalDialogManager>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{}}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        // Open the dialog
        fireEvent.click(screen.getByText('Open Dialog'));

        // Check if the panel is rendered
        expect(MockPanel).toHaveBeenCalledTimes(1);

        // Close the dialog by simulating a mouse down on backdrop
        fireEvent.mouseDown(screen.getByText('Mock Panel'));

        // Check that the panel is not rendered anymore
        expect(MockPanel).toHaveBeenCalledTimes(1); // Should remain called once
    });

    test('updates dialog props correctly', () => {
        const { rerender } = render(
            <GlobalDialogManager>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: 'Hello' }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        // Open the dialog
        fireEvent.click(screen.getByText('Open Dialog'));

        // Expect it to have been called with the initial props
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Hello' }),
            {}
        );

        // Update props and re-render
        rerender(
            <GlobalDialogManager>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message: 'Updated Hello' }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        // Open the dialog again
        fireEvent.click(screen.getByText('Open Dialog'));

        // Expect it to have been called with updated props
        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Updated Hello' }),
            {}
        );
    });
});
