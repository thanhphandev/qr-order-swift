import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormNavigationProps {
    step: number;
    isSubmitting: boolean;
    previous: () => void;
    next: () => void;
}

const FormNavigation = ({ step, isSubmitting, previous, next }: FormNavigationProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end mt-6">
            {/* Nút "Trở lại" chỉ xuất hiện khi step > 0 */}
            {step > 0 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={previous}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[120px] h-11 rounded-xl transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
                >
                    Trở lại
                </Button>
            )}

            {/* Nút "Tiếp theo" xuất hiện khi step chưa đến bước cuối */}
            {step < 2 && (
                <Button
                    type="button"
                    onClick={next}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[120px] h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-200"
                >
                    Tiếp theo
                </Button>
            )}

            {/* Nút "Tạo sản phẩm" xuất hiện ở bước cuối */}
            {step === 2 && (
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[140px] h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-200 disabled:bg-orange-300"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang thực thi...</span>
                        </div>
                    ) : (
                        "Xác nhận"
                    )}
                </Button>
            )}
        </div>
    );
};

export default FormNavigation;
