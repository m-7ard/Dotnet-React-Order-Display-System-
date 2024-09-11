export default function CoverImage(props: {
    src: string;
    className: string;
}) {
    return (
        <div className={`relative ${props.className}`}>
            <img
                className="absolute w-full h-full object-cover sm:object-contain"
                src={props.src}
                alt={props.src}
            ></img>
        </div>
    )
}