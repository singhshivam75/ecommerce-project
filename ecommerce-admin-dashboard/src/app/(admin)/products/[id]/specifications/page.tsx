"use client";

import { useParams } from "next/navigation";
import SpecificationsManager from "../../../../../components/product/specs/SpecificationsManager";

export default function Page() {
	const { id } = useParams();
	const pid = Array.isArray(id) ? id[0] : id;

	return (
		<div className="p-6">
			<SpecificationsManager productId={pid} />
		</div>
	);
}
