import { useTooltipContext } from "../contexts/TooltipContext";
import useFixedPositioning from "./useFixedPositioning";

export default function useAbstractPanelPositioning() {
    const {
        elements: { targetElement, referenceElement },
        positioning,
    } = useTooltipContext();
    
    return useFixedPositioning({ positioning, targetElement, referenceElement });
}