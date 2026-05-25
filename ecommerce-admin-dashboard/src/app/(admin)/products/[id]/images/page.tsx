"use client";

import { useParams } from "next/navigation";
import MediaManager from "../../../../../components/product/media/MediaManager";

export default function Page() {
	const { id } = useParams();
	const pid = Array.isArray(id) ? id[0] : id;

	return (
		<div className="p-6">
			<MediaManager productId={pid} />
		</div>
	);
}
