import { render, screen, fireEvent } from '@testing-library/react';
import GlobalDialog from '../../../presentation/components/Dialog/GlobalDialog';
import GlobalDialogManager from '../../../presentation/components/Dialog/GlobalDialogManager';
import '@testing-library/jest-dom';

const MockPanel = jest.fn(({ message }) => <div>Mock Panel: {message}</div>);

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
                    panelProps={{ message: 'Initial' }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        fireEvent.click(screen.getByText('Open Dialog'));
        expect(MockPanel).toHaveBeenCalledTimes(1);
        
        const panelContent = screen.getByText('Mock Panel: Initial');
        expect(panelContent).toBeInTheDocument();
        
        const backdrop = screen.getByRole("backdrop");
        fireEvent.mouseDown(backdrop);

        expect(screen.queryByText('Mock Panel: Initial')).not.toBeInTheDocument();
    });

    test('updates dialog props correctly', () => {
        const TestComponent = ({ message }: { message: string }) => (
            <GlobalDialogManager>
                <GlobalDialog
                    Trigger={MockTrigger}
                    Panel={MockPanel}
                    panelProps={{ message }}
                    zIndex={1000}
                />
            </GlobalDialogManager>
        );

        const { rerender } = render(<TestComponent message="Hello" />);

        fireEvent.click(screen.getByText('Open Dialog'));

        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Hello' }),
            expect.anything()
        );

        rerender(<TestComponent message="Updated" />);

        expect(MockPanel).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Updated' }),
            expect.anything()
        );

        expect(screen.getByText('Mock Panel: Updated')).toBeInTheDocument();
    });
});