import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UploadImagesForm from "../../../presentation/components/Forms/ImageUploadForm";
import IFormError from "../../../domain/models/IFormError";

describe("UploadImagesForm", () => {
    const mockOnDelete = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockValue = {
        "generated_file1.jpg": {
            url: "images/file1.jpg",
            originalFileName: "file1.jpg",
            generatedFileName: "generated_file1.jpg",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders uploaded images", () => {
        render(<UploadImagesForm onDelete={mockOnDelete} onSubmit={mockOnSubmit} value={mockValue} />);
        expect(screen.queryByText("file1.jpg")).toBeInTheDocument();
    });

    test("calls onDelete when Remove button is clicked", () => {
        render(<UploadImagesForm onDelete={mockOnDelete} onSubmit={mockOnSubmit} value={mockValue} />);
        fireEvent.click(screen.getByText("Remove"));
        expect(mockOnDelete).toHaveBeenCalledWith("generated_file1.jpg");
    });

    test("calls onSubmit when files are selected", async () => {
        render(<UploadImagesForm onDelete={mockOnDelete} onSubmit={mockOnSubmit} value={{}} />);
        const file = new File(["dummy content"], "test.png", { type: "image/png" });
        const input = screen.getByRole("addImage");

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith([file]);
        });
    });

    test("renders error messages when provided", () => {
        const errors: IFormError<{ [generatedFileName: string]: string[] }> = {
            _: undefined,
            [Object.keys(mockValue)[0]]: ["Error message 1", "Error message 2"],
        };
        render(<UploadImagesForm onDelete={mockOnDelete} onSubmit={mockOnSubmit} value={mockValue} errors={errors} />);
        expect(screen.getByText("Error message 1")).toBeInTheDocument();
        expect(screen.getByText("Error message 2")).toBeInTheDocument();
    });

    test("clears input value after submitting", async () => {
        render(<UploadImagesForm onDelete={mockOnDelete} onSubmit={mockOnSubmit} value={{}} />);
        const file = new File(["dummy content"], "test.png", { type: "image/png" });
        const input = screen.getByRole("addImage") as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith([file]);
            expect(input.value).toBe("");
        });
    });
});
