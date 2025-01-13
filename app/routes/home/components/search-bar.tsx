import Autocomplete from "@/components/custom/select/Autocomplete";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { useNavigate } from "@remix-run/react";
import { Control } from "react-hook-form";
import { useSearchEntity } from "~/util/hooks/fetchers/core/use-entity-search-fetcher";
import { routes } from "~/util/route";

export default function SearchBar({
}: {
}) {
  const [fetcher, onChange] = useSearchEntity({});
  const navigate = useNavigate()
  const r = routes
  
  return (
    <div>
      <Autocomplete
        onValueChange={onChange}
        data={fetcher.data?.searchEntities || []}
        // isLoading={fetcher.state == "submitting"}
        nameK={"name"}
        placeholder="Buscar..."
        isSearch={true}
        onSelect={(e)=>{
            navigate(r.to(e.href))
        }}
        />
    </div>
  );
}
