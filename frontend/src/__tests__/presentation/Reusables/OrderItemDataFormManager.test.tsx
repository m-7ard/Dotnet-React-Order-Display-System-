/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderItemDataField from "../../../presentation/components/OrderItemDataForm/OrderItemData.Field";
import { OrderItemDataFormProps } from "../../../presentation/components/OrderItemDataForm/OrderItemData.Field.Item";
import { FilterProductsPanelProps } from "../../../presentation/components/OrderItemDataForm/FilterProducts.Panel";
import { GlobalDialogProps } from "../../../presentation/components/Dialog/GlobalDialog";

const mockProduct = {
    id: 999,
    name: "New Product",
    price: 11,
    description: "description",
    dateCreated: new Date(),
    images: [],
};

jest.mock(
    "../../../presentation/components/OrderItemDataForm/OrderItemDataForm",
    () =>
        ({ value, onUpdate, onDelete }: OrderItemDataFormProps) => (
            <div data-testid="mock-order-item-data-form">
                <button onClick={() => onDelete()}>Delete</button>
                <button onClick={() => onUpdate("quantity", value.quantity + 1)}>Update</button>
            </div>
        ),
);

jest.mock(
    "../../../presentation/components/OrderItemDataForm/OrderItemDataFormManagerPanel",
    () =>
        ({ onAdd }: FilterProductsPanelProps) => (
            <div data-testid="mock-order-item-data-form-manager-panel">
                <button onClick={() => onAdd(mockProduct)}>Add Product</button>
            </div>
        ),
);

jest.mock("../../../presentation/components/Dialog/GlobalDialog", <
    T extends React.FunctionComponent<any>,
>() => ({ Trigger, Panel, panelProps }: GlobalDialogProps<T>) => (
    <div>
        <Trigger onToggle={() => {}} />
        <Panel {...panelProps} />
    </div>
));

describe("OrderItemDataFormManager", () => {
    const mockProps = {
        onDelete: jest.fn(),
        onUpdate: jest.fn(),
        onAdd: jest.fn(),
        value: {
            item1: { productId: 1, quantity: 1 },
            item2: { productId: 2, quantity: 2 },
        },
    };

    it("renders correctly", () => {
        render(<OrderItemDataField {...mockProps} />);
        expect(screen.getByText("Add")).toBeInTheDocument();
        expect(screen.getAllByTestId("mock-order-item-data-form")).toHaveLength(2);
    });

    it("calls onDelete when delete button is clicked", () => {
        render(<OrderItemDataField {...mockProps} />);
        fireEvent.click(screen.getAllByText("Delete")[0]);
        expect(mockProps.onDelete).toHaveBeenCalled();
    });

    it("calls onUpdate when update button is clicked", () => {
        render(<OrderItemDataField {...mockProps} />);
        fireEvent.click(screen.getAllByText("Update")[0]);
        expect(mockProps.onUpdate).toHaveBeenCalled();
    });

    it("calls onAdd when add button is clicked", () => {
        render(<OrderItemDataField {...mockProps} />);
        fireEvent.click(screen.getByText("Add Product"));
        expect(mockProps.onAdd).toHaveBeenCalledWith(mockProduct);
    });
});
