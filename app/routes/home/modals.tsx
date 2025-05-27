import { useSearchParams } from "@remix-run/react";
import UserModal from "../home.user.$id/user-modal";
import DealModal from "../home.deal.$id/deal-modal";
import { GlobalState } from "~/types/app-types";
import { route } from "~/util/route";
import { BookingModal } from "../home._regate.booking.$code/booking-modal";
import CustomerModal from "../home.customer.$id/customer-modal";
import CourtModal from "../home._regate.court.$id/court-modal";
import EventModal from "../home._regate.event.$id/event-modal";
import SupplierModal from "../home.supplier.$id/supplier-modal";
import WorkspaceModal from "../home.workspace.$id/workspace-modal";
import AddressModal from "../home.address.$id/address-modal";
import JournalEntryModal from "../home.journalEntry.$code/journal-entry-modal";
import ItemModal from "../home.item.$id/item-modal";

export default function AppModals({ appContext }: { appContext: GlobalState }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const userModal = searchParams.get(route.user);
  const dealModal = searchParams.get(route.deal);
  const customer = searchParams.get(route.customer);
  const supplier = searchParams.get(route.supplier);
  const booking = searchParams.get(route.booking);
  const court = searchParams.get(route.court);
  const event = searchParams.get(route.event);
  const workspace = searchParams.get(route.workspace);
  const address = searchParams.get(route.address);
  const journalEntry = searchParams.get(route.journalEntry)
  const item = searchParams.get(route.item)
  return (
    <div>
      {item && <ItemModal appContext={appContext}/>}
      {address && <AddressModal appContext={appContext} />}
      {userModal && <UserModal />}
      {dealModal && <DealModal appContext={appContext} />}
      {booking && <BookingModal appContext={appContext} />}
      {customer && <CustomerModal appContext={appContext} />}
      {court && <CourtModal appContext={appContext} />}
      {event && <EventModal appContext={appContext} />}
      {supplier && <SupplierModal appContext={appContext} />}
      {workspace && <WorkspaceModal appContext={appContext} />}
      {journalEntry && <JournalEntryModal appContext={appContext}/>}
    </div>
  );
}
