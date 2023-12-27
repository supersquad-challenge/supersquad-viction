"use client";
import SingleChallengeInfo from "@/components/common/explore/SingleChallengeInfo";
import DetailedChallengePage from "@/components/common/DetailedChallengePage";
import { useQuery } from "react-query";
import { getSingleChallenge } from "@/lib/api/querys/challenge/getSingleChallenge";
import { useParams, usePathname, useRouter } from "next/navigation";
import { SingleChallengeByChallengeIdT } from "@/types/api/Challenge";
import { DURATION } from "@/lib/protoV2Constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  DEACTIVATE_FOOTER_BLUEBUTTON,
  INITIALIZE_FOOTER_BLUEBUTTON,
  SET_FOOTER_BLUEBUTTON,
  SET_HEADER_GOBACK,
} from "@/redux/slice/layoutSlice";
import {
  CLOSE_MODAL,
  IModalState,
  OPEN_MODAL,
  getModalState,
} from "@/redux/slice/modalSlice";
import styled from "styled-components";
import colors from "@/styles/color";
import PaymentSelectModal from "@/components/common/explore/PaymentSelectModal";
import DepositChargeModal from "@/components/common/explore/DepositChargeModal";
import { PaymentMethod } from "@/types/Modal";
import FullPageModal from "@/components/base/Modal/FullPageModal";
import { nowYouAreInSrc } from "@/lib/components/fullPageModal";
import { getIsLoggedInState, getUserIDState } from "@/redux/slice/authSlice";

const ExploreID = () => {
  // variables //
  const { id } = useParams<{ id: string }>();
  const challengeId: string = id as string;
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [deposit, setDeposit] = useState<number>(10);
  const router = useRouter();

  const modal: IModalState = useSelector(getModalState);
  const userId = useSelector(getUserIDState);
  const isLoggedIn = useSelector(getIsLoggedInState);

  const {
    data: challenge,
    error,
    isLoading,
  } = useQuery<SingleChallengeByChallengeIdT>({
    queryKey: [`singleChallenge-${challengeId}`],
    queryFn: async () => {
      const res = await getSingleChallenge({ challengeId: challengeId });
      console.log("res", res);
      const challenge = res.challengeInfo;
      return challenge;
    },
    staleTime: 5000,
    cacheTime: Infinity,
  });

  useEffect(() => {
    dispatch(
      SET_FOOTER_BLUEBUTTON({
        blueButtonTitle: "I am in!",
        handleBlueButtonClick: () => {
          dispatch(INITIALIZE_FOOTER_BLUEBUTTON());
          dispatch(OPEN_MODAL({ modal: "paymentSelect" }));
        },
      })
    );
  }, []);

  useEffect(() => {
    dispatch(
      SET_HEADER_GOBACK({
        handleGoBackButtonClick: () => {
          router.push("/explore");
        },
      })
    );
  }, []);

  if (error) {
    return null;
  }

  return modal.activeModal === "nowYouAreIn" && modal.visibility === true ? (
    <FullPageModal
      {...nowYouAreInSrc}
      onClickHandler={() => {
        router.push("/mychallenge");
        dispatch(CLOSE_MODAL());
      }}
      goBackButtonClickHandler={() => {
        router.push("/explore");
        dispatch(CLOSE_MODAL());
      }}
    />
  ) : (
    <Container>
      {modal.activeModal === "paymentSelect" && modal.visibility === true && (
        <PaymentSelectModal
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      )}

      {modal.activeModal === "depositCharge" &&
        modal.visibility === true &&
        challenge && (
          <DepositChargeModal
            poolAddress={challenge.successPoolAddress}
            paymentMethod={paymentMethod}
            challengeId={id}
            deposit={deposit}
            setDeposit={setDeposit}
          />
        )}

      <DetailedChallengePage
        thumbnailUrl={challenge?.thumbnailUrl!}
        frequency={challenge?.frequency!}
        name={challenge?.name!}
        participants={challenge?.participants!}
        profileUrls={challenge?.profileUrls ? challenge?.profileUrls : []}
      >
        <SingleChallengeInfo
          title="Duration"
          content={DURATION}
          detail={challenge?.frequency!}
        />
        <SingleChallengeInfo
          title="How To"
          content={challenge?.howTo.split("*")[0]!}
          detail={challenge?.howTo.split("*")[1]!}
        />
        <SingleChallengeInfo
          title="Why this challenge?"
          content=""
          detail={challenge?.description!}
        />
      </DetailedChallengePage>
    </Container>
  );
};

export default ExploreID;

const Container = styled.main`
  width: 100%;
  height: auto;
  background-color: ${colors.white};
`;
