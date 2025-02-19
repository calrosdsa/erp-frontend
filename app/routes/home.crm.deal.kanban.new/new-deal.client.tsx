import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFetcher, useLoaderData, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { action, loader } from "./route";
import { useDealStore } from "./deal-store";
import { DealData, dealSchema } from "~/util/data/schemas/crm/deal.schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import DealForm from "./deal-form";
import StagesHeader from "../home.stage/components/stages-header";
import { GlobalState } from "~/types/app";
import { fullName } from "~/util/convertor/convertor";

export default function NewDealClient() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const {stages} = useLoaderData<typeof loader>()
  const {profile} = useOutletContext<GlobalState>()
  const fetcher = useFetcher<typeof action>();
  const { payload, setPayload } = useDealStore();
  const form = useForm<DealData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      ...payload,
      responsible:{
        id:profile?.id,
        name:fullName(profile?.given_name,profile?.family_name),
        uuid:profile?.uuid
      },

    },
  });
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const watchedFields = useWatch({
    control: form.control,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (e: DealData) => {
    fetcher.submit(
      {
        action: "create",
        createData: e as any,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(-1);
      }
    }
  }, [fetcher.data]);

  useEffect(() => {
    setPayload(form.getValues());
  }, [watchedFields]);

  useEffect(() => {
    if (!open) {
      navigate(-1);
    }
  }, [open]);
  return (
    <div>
      <Sheet open={open} onOpenChange={(e) => setOpen(e)}>
        <SheetContent className="md:max-w-full md:w-[80%] overflow-auto">
          <SheetHeader>
            <div className="flex justify-between pt-2">
            <SheetTitle>Nuevo trato</SheetTitle>
            <Button size={"sm"} variant={"outline"} onClick={()=>{
                inputRef.current?.click()
            }}>
                Save
            </Button>
            </div>
            <StagesHeader
            stages={stages}
            />
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <DealForm
              form={form}
              fetcher={fetcher}
              inputRef={inputRef}
              onSubmit={onSubmit}
              allowEdit={true}
            />
          </div>
          {/* <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  );
}
