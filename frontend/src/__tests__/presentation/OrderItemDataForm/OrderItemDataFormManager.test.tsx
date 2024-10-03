
import { render, screen, fireEvent } from '@testing-library/react';
import OrderItemDataFormManager from '../../../presentation/components/OrderItemDataForm/OrderItemDataFormManager';
import GlobalDialogManager from '../../../presentation/components/Dialog/GlobalDialogManager';
import { ComponentProps } from 'react';
import '@testing-library/jest-dom';
import IProduct from '../../../domain/models/IProduct';

describe('OrderItemDataFormManager', () => {
    const mockValue: ComponentProps<typeof OrderItemDataFormManager>["value"] = {
        'UID1': { productId: 1, quantity: 2 },
        'UID2': { productId: 2, quantity: 5 },
    };
    const mockErrors: ComponentProps<typeof OrderItemDataFormManager>["errors"] = {
        _: undefined
    };

    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();
    const mockOnAdd = jest.fn((product: IProduct) => mockValue[crypto.randomUUID()] = );

    beforeEach(() => {
        render(
            <GlobalDialogManager>
                <OrderItemDataFormManager
                    onDelete={mockOnDelete}
                    onUpdate={mockOnUpdate}
                    onAdd={mockOnAdd}
                    errors={mockErrors}
                    value={mockValue}
                />
            </GlobalDialogManager>
        );
    });

    it('calls onDelete when the delete button is clicked', () => {
        const deleteButton = screen.getByText('Remove Item');
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith('UID1');
    });

    it('calls onUpdate when an input is modified', () => {
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '3' } });
        expect(mockOnUpdate).toHaveBeenCalledWith('UID1', { productId: '1', quantity: 3 });
    });

    it('calls onAdd when a new product is added', () => {
        const addButton = screen.getByText('Add Product');
        fireEvent.click(addButton);
        expect(mockOnAdd).toHaveBeenCalled();
    });
});
